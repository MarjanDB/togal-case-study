import { Body, Controller, Get, Inject, NotFoundException, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AddVirtualDocumentToVirtualFolder } from "Delivery/Controllers/VirtualFolders/AddVirtualDocumentToVirtualFolder";
import { CreateVirtualFolder } from "Delivery/Controllers/VirtualFolders/CreateVirtualFolder";
import { GetVirtualFolders } from "Delivery/Controllers/VirtualFolders/GetVirtualFolders";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { AssociateVirtualDocumentWithVirtualFolderAction } from "Modules/VirtualFolder/Actions/AssociateVirtualDocumentWithVirtualFolderAction";
import { CreateVirtualFolderAction } from "Modules/VirtualFolder/Actions/CreateVirtualFolderAction";
import { GetAllVirtualFoldersWithAssociatedVirtualDocumentsAction } from "Modules/VirtualFolder/Actions/GetAllVirtualFoldersWithAssociatedVirtualDocumentsAction";
import { GetVirtualFoldersWithAssociatedVirtualDocumentsAction } from "Modules/VirtualFolder/Actions/GetVirtualFoldersWithAssociatedVirtualDocumentsAction";
import { VirtualFolder } from "Modules/VirtualFolder/Entities/VirtualFolder";

@Controller("virtual-folders")
export class VirtualFoldersController {
	public constructor(
		@Inject(GetVirtualFoldersWithAssociatedVirtualDocumentsAction.Action)
		private readonly getVirtualFoldersAction: GetVirtualFoldersWithAssociatedVirtualDocumentsAction.Action,
		@Inject(GetAllVirtualFoldersWithAssociatedVirtualDocumentsAction.Action)
		private readonly getAllVirtualFoldersAction: GetAllVirtualFoldersWithAssociatedVirtualDocumentsAction.Action,
		@Inject(CreateVirtualFolderAction.Action)
		private readonly createVirtualFolderAction: CreateVirtualFolderAction.Action,
		@Inject(AssociateVirtualDocumentWithVirtualFolderAction.Action)
		private readonly associateVirtualDocumentWithVirtualFolderAction: AssociateVirtualDocumentWithVirtualFolderAction.Action,
	) {}

	@Get("all-folders")
	@ApiOperation({ summary: "Get all virtual folders" })
	@ApiResponse({ status: 200, type: GetVirtualFolders.Response })
	public async getVirtualFolders(): Promise<GetVirtualFolders.Response> {
		const virtualFolders = await this.getAllVirtualFoldersAction.execute();

		const response: GetVirtualFolders.Response["virtualFolders"] = virtualFolders.map((virtualFolder) => ({
			id: virtualFolder.virtualFolder.id,
			name: virtualFolder.virtualFolder.name,
			createdAt: virtualFolder.virtualFolder.createdAt,
			updatedAt: virtualFolder.virtualFolder.updatedAt,
			virtualDocumentIds: virtualFolder.virtualDocumentIds,
		}));

		return {
			virtualFolders: response,
		};
	}

	@Post("create-folder")
	@ApiOperation({ summary: "Create a virtual folder" })
	@ApiResponse({ status: 200, type: CreateVirtualFolder.Response })
	public async createVirtualFolder(@Body() body: CreateVirtualFolder.Parameters): Promise<CreateVirtualFolder.Response> {
		const virtualFolder = await this.createVirtualFolderAction.execute(body.name);

		return {
			id: virtualFolder.id,
			name: virtualFolder.name,
			createdAt: virtualFolder.createdAt,
			updatedAt: virtualFolder.updatedAt,
			virtualDocumentIds: [],
		};
	}

	@Post("add-virtual-document-to-folder")
	@ApiOperation({ summary: "Add a virtual document to a virtual folder" })
	@ApiResponse({ status: 200, type: AddVirtualDocumentToVirtualFolder.Response })
	public async addVirtualDocumentToFolder(
		@Body() body: AddVirtualDocumentToVirtualFolder.Parameters,
	): Promise<AddVirtualDocumentToVirtualFolder.Response> {
		// This should ideally be a query that searches the specific virtual folder
		// in question, and not fetching all and filtering out in code
		const virtualFolders = await this.getVirtualFoldersAction.execute([body.virtualFolderId as VirtualFolder.Types.IdType]);
		const virtualFolder = virtualFolders.find((virtualFolder) => virtualFolder.virtualFolder.id === body.virtualFolderId);

		if (!virtualFolder) {
			throw new NotFoundException("Virtual folder not found");
		}

		for (const virtualDocumentId of body.virtualDocumentIds) {
			// This should ideally be a single query that assigns all of the virtual documents to the virtual folder
			// And not a loop that does this one by one
			await this.associateVirtualDocumentWithVirtualFolderAction.execute(
				body.virtualFolderId as VirtualFolder.Types.IdType,
				virtualDocumentId as VirtualDocument.Types.IdType,
			);
		}

		const updatedVirtualFolders = await this.getVirtualFoldersAction.execute([body.virtualFolderId as VirtualFolder.Types.IdType]);
		const updatedVirtualFolder = updatedVirtualFolders.find((virtualFolder) => virtualFolder.virtualFolder.id === body.virtualFolderId);

		if (!updatedVirtualFolder) {
			throw new NotFoundException("Virtual folder not found");
		}

		return {
			id: updatedVirtualFolder.virtualFolder.id,
			name: updatedVirtualFolder.virtualFolder.name,
			createdAt: updatedVirtualFolder.virtualFolder.createdAt,
			updatedAt: updatedVirtualFolder.virtualFolder.updatedAt,
			virtualDocumentIds: updatedVirtualFolder.virtualDocumentIds,
		};
	}
}

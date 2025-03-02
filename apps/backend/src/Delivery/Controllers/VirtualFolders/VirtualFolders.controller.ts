import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateVirtualFolder } from "Delivery/Controllers/VirtualFolders/CreateVirtualFolder";
import { GetVirtualFolders } from "Delivery/Controllers/VirtualFolders/GetVirtualFolders";
import { CreateVirtualFolderAction } from "Modules/VirtualFolder/Actions/CreateVirtualFolderAction";
import { GetVirtualFoldersWithAssociatedVirtualDocumentsAction } from "Modules/VirtualFolder/Actions/GetVirtualFoldersWithAssociatedVirtualDocumentsAction";

@Controller("virtual-folders")
export class VirtualFoldersController {
	public constructor(
		@Inject(GetVirtualFoldersWithAssociatedVirtualDocumentsAction.Action)
		private readonly getVirtualFoldersAction: GetVirtualFoldersWithAssociatedVirtualDocumentsAction.Action,
		@Inject(CreateVirtualFolderAction.Action)
		private readonly createVirtualFolderAction: CreateVirtualFolderAction.Action,
	) {}

	@Get("all-folders")
	@ApiOperation({ summary: "Get all virtual folders" })
	@ApiResponse({ status: 200, type: GetVirtualFolders.Response })
	public async getVirtualFolders(): Promise<GetVirtualFolders.Response> {
		const virtualFolders = await this.getVirtualFoldersAction.execute();

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
		};
	}
}

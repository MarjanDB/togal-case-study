import { GetVirtualFoldersActionWithAssociatedVirtualDocumentsAction } from "@backend/Modules/VirtualFolder/Actions/GetVirtualFoldersActionWithAssociatedVirtualDocumentsAction";
import { GetVirtualFolders } from "@contracts/Endpoints/GetVirtualFolders";
import { Controller, Get, Inject } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("virtual-folders")
export class VirtualFoldersController {
	public constructor(
		@Inject(GetVirtualFoldersActionWithAssociatedVirtualDocumentsAction)
		private readonly getVirtualFoldersAction: GetVirtualFoldersActionWithAssociatedVirtualDocumentsAction,
	) {}

	@Get("all-folders")
	@ApiOperation({ summary: "Get all virtual folders" })
	@ApiResponse({ status: 200, type: GetVirtualFolders.Response, isArray: true })
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
}

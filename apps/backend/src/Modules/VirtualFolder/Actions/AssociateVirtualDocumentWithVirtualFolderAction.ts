import { VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { IVirtualFolderVirtualDocumentsProvider } from "@backend/Modules/VirtualFolder/Contracts/IVirtualFolderVirtualDocumentsProvider";
import { VirtualFolderId } from "@backend/Modules/VirtualFolder/Entities/VirtualFolder";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class AssociateVirtualDocumentWithVirtualFolderAction {
	public constructor(
		@Inject(IVirtualFolderVirtualDocumentsProvider)
		private readonly virtualFolderVirtualDocumentsProvider: IVirtualFolderVirtualDocumentsProvider,
	) {}

	public async execute(virtualFolderId: VirtualFolderId, virtualDocumentId: VirtualDocumentId): Promise<void> {
		await this.virtualFolderVirtualDocumentsProvider.addVirtualDocumentToVirtualFolder(virtualFolderId, virtualDocumentId);
	}
}

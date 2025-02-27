import { Inject, Injectable } from "@nestjs/common";
import { VirtualDocumentId } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { IVirtualFolderVirtualDocumentsProvider } from "Modules/VirtualFolder/Contracts/IVirtualFolderVirtualDocumentsProvider";
import { VirtualFolderId } from "Modules/VirtualFolder/Entities/VirtualFolder";

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

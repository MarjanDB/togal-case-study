import { Inject, Injectable } from "@nestjs/common";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { IVirtualFolderVirtualDocumentsProvider } from "Modules/VirtualFolder/Contracts/IVirtualFolderVirtualDocumentsProvider";
import { VirtualFolder } from "Modules/VirtualFolder/Entities/VirtualFolder";

export namespace AssociateVirtualDocumentWithVirtualFolderAction {
	@Injectable()
	export class Action {
		public constructor(
			@Inject(IVirtualFolderVirtualDocumentsProvider.Interface)
			private readonly virtualFolderVirtualDocumentsProvider: IVirtualFolderVirtualDocumentsProvider.Interface,
		) {}

		public async execute(virtualFolderId: VirtualFolder.Types.IdType, virtualDocumentId: VirtualDocument.Types.IdType): Promise<void> {
			await this.virtualFolderVirtualDocumentsProvider.addVirtualDocumentToVirtualFolder(virtualFolderId, virtualDocumentId);
		}
	}
}

import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { DateTime } from "luxon";
import { GetVirtualDocumentsAction } from "Modules/VirtualDocument/Actions/GetVirtualDocumentsAction";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { IVirtualFolderProvider } from "Modules/VirtualFolder/Contracts/IVirtualFolderProvider";
import { IVirtualFolderVirtualDocumentsProvider } from "Modules/VirtualFolder/Contracts/IVirtualFolderVirtualDocumentsProvider";
import { VirtualFolder } from "Modules/VirtualFolder/Entities/VirtualFolder";

export namespace AssociateVirtualDocumentWithVirtualFolderAction {
	@Injectable()
	export class Action {
		public constructor(
			@Inject(IVirtualFolderVirtualDocumentsProvider.Interface)
			private readonly virtualFolderVirtualDocumentsProvider: IVirtualFolderVirtualDocumentsProvider.Interface,
			@Inject(IVirtualFolderProvider.Interface)
			private readonly virtualFolderProvider: IVirtualFolderProvider.Interface,
			@Inject(GetVirtualDocumentsAction.Action)
			private readonly getVirtualDocumentsAction: GetVirtualDocumentsAction.Action,
		) {}

		public async execute(virtualFolderId: VirtualFolder.Types.IdType, virtualDocumentId: VirtualDocument.Types.IdType): Promise<void> {
			// These following lines serve as a sanity check to ensure that the virtual folder and virtual document exist
			const virtualFolders = await this.virtualFolderProvider.findbyIdsWithAssociatedVirtualDocuments([virtualFolderId]);
			const virtualDocuments = await this.getVirtualDocumentsAction.execute([virtualDocumentId]);

			if (virtualDocuments.length === 0) {
				throw new BadRequestException("Virtual document does not exist");
			}

			if (virtualFolders.length === 0) {
				throw new BadRequestException("Virtual folder does not exist");
			}

			// if the virtual document is already associated with this virtual folder, do nothing
			if (virtualFolders.some((virtualFolder) => virtualFolder.virtual_document_id === virtualDocumentId)) {
				return;
			}

			await this.virtualFolderVirtualDocumentsProvider.addVirtualDocumentToVirtualFolder(virtualFolderId, virtualDocumentId);

			await this.virtualFolderProvider.update([
				{
					id: virtualFolderId,
					updated_at: DateTime.now(),
				},
			]);
		}
	}
}

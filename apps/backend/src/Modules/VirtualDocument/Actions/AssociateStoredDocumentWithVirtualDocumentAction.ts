import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DateTime } from "luxon";
import { CheckForExistingStoredDocumentByIdAction } from "Modules/StoredDocument/Actions/CheckForExistingStoredDocumentByIdAction";
import { FindStoredDocumentsBelongingToVirtualDocumentsAction } from "Modules/StoredDocument/Actions/FindStoredDocumentsBelongingToVirtualDocumentsAction";
import { StoredDocument } from "Modules/StoredDocument/Entities/StoredDocument";
import { IVirtualDocumentProvider } from "Modules/VirtualDocument/Contracts/IVirtualDocumentProvider";
import { IVirtualDocumentStoredDocumentsProvider } from "Modules/VirtualDocument/Contracts/IVirtualDocumentStoredDocumentsProvider";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";

export namespace AssociateStoredDocumentWithVirtualDocumentAction {
	@Injectable()
	export class Action {
		public constructor(
			@Inject(IVirtualDocumentStoredDocumentsProvider.Interface)
			private readonly virtualDocumentStoredDocumentsProvider: IVirtualDocumentStoredDocumentsProvider.Interface,
			@Inject(IVirtualDocumentProvider.Interface)
			private readonly virtualDocumentProvider: IVirtualDocumentProvider.Interface,
			@Inject(FindStoredDocumentsBelongingToVirtualDocumentsAction.Action)
			private readonly findStoredDocumentsBelongingToVirtualDocumentsAction: FindStoredDocumentsBelongingToVirtualDocumentsAction.Action,
			@Inject(CheckForExistingStoredDocumentByIdAction.Action)
			private readonly checkForExistingStoredDocumentByIdAction: CheckForExistingStoredDocumentByIdAction.Action,
		) {}

		public async execute(virtualDocumentId: VirtualDocument.Types.IdType, storedDocumentId: StoredDocument.Types.IdType): Promise<void> {
			// The following two lines serve as sanity checks to ensure that the virtual document and stored document exist
			await this.virtualDocumentProvider.findById(virtualDocumentId);
			if (!(await this.checkForExistingStoredDocumentByIdAction.execute(storedDocumentId))) {
				throw new NotFoundException("Stored document not found");
			}

			// And these two just treat multiple associations as a no-op
			const storedDocuments = await this.findStoredDocumentsBelongingToVirtualDocumentsAction.execute([virtualDocumentId]);
			if (storedDocuments[virtualDocumentId as VirtualDocument.Types.IdType]?.[storedDocumentId as StoredDocument.Types.IdType]) {
				return;
			}

			await this.virtualDocumentStoredDocumentsProvider.addStoredDocumentToVirtualDocument(virtualDocumentId, storedDocumentId);

			await this.virtualDocumentProvider.update([
				{
					id: virtualDocumentId,
					updated_at: DateTime.now(),
				},
			]);
		}
	}
}

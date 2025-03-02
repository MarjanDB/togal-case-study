import { Inject, Injectable } from "@nestjs/common";
import { DateTime } from "luxon";
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
		) {}

		public async execute(virtualDocumentId: VirtualDocument.Types.IdType, storedDocumentId: StoredDocument.Types.IdType): Promise<void> {
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

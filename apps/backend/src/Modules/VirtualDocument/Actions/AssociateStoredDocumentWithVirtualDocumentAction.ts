import { Inject, Injectable } from "@nestjs/common";
import { StoredDocument } from "Modules/StoredDocument/Entities/StoredDocument";
import { IVirtualDocumentStoredDocumentsProvider } from "Modules/VirtualDocument/Contracts/IVirtualDocumentStoredDocumentsProvider";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";

export namespace AssociateStoredDocumentWithVirtualDocumentAction {
	@Injectable()
	export class Action {
		public constructor(
			@Inject(IVirtualDocumentStoredDocumentsProvider.Interface)
			private readonly virtualDocumentStoredDocumentsProvider: IVirtualDocumentStoredDocumentsProvider.Interface,
		) {}

		public async execute(virtualDocumentId: VirtualDocument.Types.IdType, storedDocumentId: StoredDocument.Types.IdType): Promise<void> {
			await this.virtualDocumentStoredDocumentsProvider.addStoredDocumentToVirtualDocument(virtualDocumentId, storedDocumentId);
		}
	}
}

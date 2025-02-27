import { Inject, Injectable } from "@nestjs/common";
import { StoredDocumentId } from "Modules/StoredDocument/Entities/StoredDocument";
import { IVirtualDocumentStoredDocumentsProvider } from "Modules/VirtualDocument/Contracts/IVirtualDocumentStoredDocumentsProvider";
import { VirtualDocumentId } from "Modules/VirtualDocument/Entities/VirtualDocument";

@Injectable()
export class AssociateStoredDocumentWithVirtualDocumentAction {
	public constructor(
		@Inject(IVirtualDocumentStoredDocumentsProvider)
		private readonly virtualDocumentStoredDocumentsProvider: IVirtualDocumentStoredDocumentsProvider,
	) {}

	public async execute(virtualDocumentId: VirtualDocumentId, storedDocumentId: StoredDocumentId): Promise<void> {
		await this.virtualDocumentStoredDocumentsProvider.addStoredDocumentToVirtualDocument(virtualDocumentId, storedDocumentId);
	}
}

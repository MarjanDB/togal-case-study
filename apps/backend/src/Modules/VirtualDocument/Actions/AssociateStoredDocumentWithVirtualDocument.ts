import { StoredDocumentId } from "@backend/Modules/StoredDocument/Entities/StoredDocument";
import { VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualDocumentStoredDocumentsProvider } from "@backend/Modules/VirtualDocument/Providers/VirtualDocumentStoredDocumentsProvider";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class AssociateStoredDocumentWithVirtualDocument {
	public constructor(
		@Inject(VirtualDocumentStoredDocumentsProvider)
		private readonly virtualDocumentStoredDocumentsProvider: VirtualDocumentStoredDocumentsProvider,
	) {}

	public async execute(virtualDocumentId: VirtualDocumentId, storedDocumentId: StoredDocumentId): Promise<void> {
		await this.virtualDocumentStoredDocumentsProvider.addStoredDocumentToVirtualDocument(virtualDocumentId, storedDocumentId);
	}
}

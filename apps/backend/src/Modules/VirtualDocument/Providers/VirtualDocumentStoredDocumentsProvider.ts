import { StoredDocumentId } from "@backend/Modules/StoredDocument/Entities/StoredDocument";
import { IVirtualDocumentStoredDocumentsProvider } from "@backend/Modules/VirtualDocument/Contracts/IVirtualDocumentStoredDocumentsProvider";
import { VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualDocumentStoredDocumentDto } from "@backend/Modules/VirtualDocument/Entities/VirtualDocumentStoredDocument";
import { IPostgresDatabaseProvider } from "@backend/Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";
import { Inject } from "@nestjs/common";

export class VirtualDocumentStoredDocumentsProvider implements IVirtualDocumentStoredDocumentsProvider {
	public constructor(@Inject(IPostgresDatabaseProvider) private readonly database: IPostgresDatabaseProvider) {}

	public async addStoredDocumentToVirtualDocument(virtualDocumentId: VirtualDocumentId, storedDocumentId: StoredDocumentId): Promise<void> {
		const toInsert: VirtualDocumentStoredDocumentDto = { virtual_document_id: virtualDocumentId, stored_document_id: storedDocumentId };

		await this.database.insert([toInsert], ["virtual_document_id", "stored_document_id"], "virtual_documents_stored_documents");
	}
}

import { Inject } from "@nestjs/common";
import { StoredDocumentId } from "Modules/StoredDocument/Entities/StoredDocument";
import { IVirtualDocumentStoredDocumentsProvider } from "Modules/VirtualDocument/Contracts/IVirtualDocumentStoredDocumentsProvider";
import { VirtualDocumentId } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualDocumentStoredDocumentDto } from "Modules/VirtualDocument/Entities/VirtualDocumentStoredDocument";
import { IPostgresDatabaseProvider } from "Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";

export class VirtualDocumentStoredDocumentsProvider implements IVirtualDocumentStoredDocumentsProvider {
	public constructor(@Inject(IPostgresDatabaseProvider) private readonly database: IPostgresDatabaseProvider) {}

	public async addStoredDocumentToVirtualDocument(virtualDocumentId: VirtualDocumentId, storedDocumentId: StoredDocumentId): Promise<void> {
		const toInsert: VirtualDocumentStoredDocumentDto = { virtual_document_id: virtualDocumentId, stored_document_id: storedDocumentId };

		await this.database.insert([toInsert], ["virtual_document_id", "stored_document_id"], "virtual_documents_stored_documents");
	}
}

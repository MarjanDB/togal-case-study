import { Inject } from "@nestjs/common";
import { StoredDocument } from "Modules/StoredDocument/Entities/StoredDocument";
import { IVirtualDocumentStoredDocumentsProvider } from "Modules/VirtualDocument/Contracts/IVirtualDocumentStoredDocumentsProvider";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualDocumentStoredDocument } from "Modules/VirtualDocument/Entities/VirtualDocumentStoredDocument";
import { IPostgresDatabaseProvider } from "Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";

export class VirtualDocumentStoredDocumentsProvider implements IVirtualDocumentStoredDocumentsProvider.Interface {
	public constructor(@Inject(IPostgresDatabaseProvider) private readonly database: IPostgresDatabaseProvider) {}

	public async addStoredDocumentToVirtualDocument(
		virtualDocumentId: VirtualDocument.Types.IdType,
		storedDocumentId: StoredDocument.Types.IdType,
	): Promise<void> {
		const toInsert: VirtualDocumentStoredDocument.Types.Dto = {
			virtual_document_id: virtualDocumentId,
			stored_document_id: storedDocumentId,
		};

		await this.database.insert([toInsert], ["virtual_document_id", "stored_document_id"], "virtual_documents_stored_documents");
	}
}

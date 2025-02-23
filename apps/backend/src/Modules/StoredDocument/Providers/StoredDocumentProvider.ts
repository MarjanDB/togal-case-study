import { FindStoredDocumentsBelongingToVirtualDocumentsActionTypes } from "@backend/Modules/StoredDocument/Actions/FindStoredDocumentsBelongingToVirtualDocuments";
import {
	StoredDocument,
	StoredDocumentDto,
	StoredDocumentHash,
	StoredDocumentId,
} from "@backend/Modules/StoredDocument/Entities/StoredDocument";
import { VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { IPostgresDatabaseProvider } from "@backend/Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class StoredDocumentProvider {
	public constructor(@Inject(IPostgresDatabaseProvider) private readonly database: IPostgresDatabaseProvider) {}

	public async create(document: StoredDocument): Promise<void> {
		const dto = StoredDocument.toDto(document);
		await this.database.insert([dto], ["id", "hash", "stored_at", "original_file_name", "data"], "stored_documents");
	}

	public async findById(id: StoredDocumentId): Promise<StoredDocument> {
		const result = await this.database.query("SELECT * FROM stored_documents WHERE id = $/id/", { id: id }, StoredDocumentDto.asserterArray);

		if (result.length === 0) {
			throw new NotFoundException("Stored document not found");
		}

		return StoredDocument.fromDto(result[0]);
	}

	public async findByHash(hash: StoredDocumentHash): Promise<StoredDocument[]> {
		const result = await this.database.query(
			"SELECT * FROM stored_documents WHERE hash = $hash",
			{ hash: hash },
			StoredDocumentDto.asserterArray,
		);

		if (result.length === 0) {
			throw new NotFoundException("Stored document not found");
		}

		return result.map(StoredDocument.fromDto);
	}

	public async findForVirtualDocuments(
		virtualDocumentIds: VirtualDocumentId[],
	): Promise<FindStoredDocumentsBelongingToVirtualDocumentsActionTypes.QueryResult[]> {
		const result = await this.database.query(
			`SELECT stored_documents.*, vdsd.id as virtual_document_stored_document_id
			FROM stored_documents
			INNER JOIN virtual_document_stored_documents AS vdsd ON stored_documents.id = vdsd.stored_document_id
			WHERE vdsd.virtual_document_id IN ($/virtual_document_ids/:csv)
			ORDER BY stored_at DESC`,
			{ virtual_document_ids: virtualDocumentIds },
			FindStoredDocumentsBelongingToVirtualDocumentsActionTypes.QueryResult.asserterArray,
		);

		return result;
	}
}

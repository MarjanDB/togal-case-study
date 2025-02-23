import { FindMostRecentStoredDocumentBelongingToVirtualDocumentActionTypes } from "@backend/Modules/StoredDocument/Actions/FindMostRecentStoredDocumentBelongingToVirtualDocumentAction";
import { FindStoredDocumentsBelongingToVirtualDocumentsActionTypes } from "@backend/Modules/StoredDocument/Actions/FindStoredDocumentsBelongingToVirtualDocumentsAction";
import { IStoredDocumentProvider } from "@backend/Modules/StoredDocument/Contracts/IStoredDocumentProvider";
import {
	StoredDocument,
	StoredDocumentDto,
	StoredDocumentHash,
	StoredDocumentId,
} from "@backend/Modules/StoredDocument/Entities/StoredDocument";
import { VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { IPostgresDatabaseProvider } from "@backend/Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";
import { Inject, NotFoundException } from "@nestjs/common";

export class StoredDocumentProvider implements IStoredDocumentProvider {
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
			`SELECT sd.*, vdsd.virtual_document_id
			FROM stored_documents sd
			INNER JOIN virtual_documents_stored_documents AS vdsd ON vdsd.stored_document_id = sd.id
			WHERE vdsd.virtual_document_id IN ($/virtual_document_ids:csv/)
			ORDER BY sd.stored_at DESC`,
			{ virtual_document_ids: virtualDocumentIds },
			FindStoredDocumentsBelongingToVirtualDocumentsActionTypes.QueryResult.asserterArray,
		);

		return result;
	}

	public async findMostRecentForVirtualDocuments(
		virtualDocumentIds: VirtualDocumentId[],
	): Promise<FindMostRecentStoredDocumentBelongingToVirtualDocumentActionTypes.QueryResult[]> {
		const result = await this.database.query(
			`
			WITH ranked_stored_documents AS (
				SELECT
					vdsd.virtual_document_id,
					sd.*,
					ROW_NUMBER() OVER (PARTITION BY vdsd.virtual_document_id ORDER BY sd.stored_at DESC) AS ranked
				FROM stored_documents sd
				INNER JOIN virtual_documents_stored_documents vdsd ON vdsd.stored_document_id = sd.id
				WHERE vdsd.virtual_document_id IN ($/virtual_document_ids:csv/)
			)
			SELECT * from ranked_stored_documents
			WHERE ranked = 1`,
			{ virtual_document_ids: virtualDocumentIds },
			FindMostRecentStoredDocumentBelongingToVirtualDocumentActionTypes.QueryResult.asserterArray,
		);

		return result;
	}
}

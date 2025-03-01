import { Inject, NotFoundException } from "@nestjs/common";
import { IStoredDocumentProvider } from "Modules/StoredDocument/Contracts/IStoredDocumentProvider";
import { StoredDocument } from "Modules/StoredDocument/Entities/StoredDocument";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { IPostgresDatabaseProvider } from "Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";

export class StoredDocumentProvider implements IStoredDocumentProvider.Interface {
	public constructor(@Inject(IPostgresDatabaseProvider) private readonly database: IPostgresDatabaseProvider) {}

	public async create(document: StoredDocument.Entity): Promise<void> {
		const dto = StoredDocument.Entity.toDto(document);
		await this.database.insert([dto], ["id", "hash", "stored_at", "original_file_name", "data"], "stored_documents");
	}

	public async findById(id: StoredDocument.Types.IdType): Promise<StoredDocument.Entity> {
		const result = await this.database.query(
			"SELECT * FROM stored_documents WHERE id = $/id/",
			{ id: id },
			StoredDocument.Types.Dto.asserterArray,
		);

		if (result.length === 0) {
			throw new NotFoundException("Stored document not found");
		}

		return StoredDocument.Entity.fromDto(result[0]);
	}

	public async findByHash(hash: StoredDocument.Types.HashType): Promise<StoredDocument.Entity[]> {
		const result = await this.database.query(
			"SELECT * FROM stored_documents WHERE hash = $hash",
			{ hash: hash },
			StoredDocument.Types.Dto.asserterArray,
		);

		if (result.length === 0) {
			throw new NotFoundException("Stored document not found");
		}

		return result.map(StoredDocument.Entity.fromDto);
	}

	public async findForVirtualDocuments(
		virtualDocumentIds: VirtualDocument.Types.IdType[],
	): Promise<IStoredDocumentProvider.Types.FindForVirtualDocuments[]> {
		const result = await this.database.query(
			`SELECT sd.*, vdsd.virtual_document_id
			FROM stored_documents sd
			INNER JOIN virtual_documents_stored_documents AS vdsd ON vdsd.stored_document_id = sd.id
			WHERE vdsd.virtual_document_id IN ($/virtual_document_ids:csv/)
			ORDER BY sd.stored_at DESC`,
			{ virtual_document_ids: virtualDocumentIds },
			IStoredDocumentProvider.Types.FindForVirtualDocuments.asserterArray,
		);

		return result;
	}

	public async findMostRecentStoredDocumentEntriesForVirtualDocuments(
		virtualDocumentIds: VirtualDocument.Types.IdType[],
	): Promise<IStoredDocumentProvider.Types.FindMostRecentStoredDocumentEntriesForVirtualDocuments[]> {
		const result = await this.database.query(
			`
			WITH ranked_stored_documents AS (
				SELECT
					vdsd.virtual_document_id,
					sd.id,
					sd.hash,
					sd.stored_at,
					sd.original_file_name,
					ROW_NUMBER() OVER (PARTITION BY vdsd.virtual_document_id ORDER BY sd.stored_at DESC) AS ranked
				FROM stored_documents sd
				INNER JOIN virtual_documents_stored_documents vdsd ON vdsd.stored_document_id = sd.id
				WHERE vdsd.virtual_document_id IN ($/virtual_document_ids:csv/)
			)
			SELECT * from ranked_stored_documents
			WHERE ranked = 1`,
			{ virtual_document_ids: virtualDocumentIds },
			IStoredDocumentProvider.Types.FindMostRecentStoredDocumentEntriesForVirtualDocuments.asserterArray,
		);

		return result;
	}
}

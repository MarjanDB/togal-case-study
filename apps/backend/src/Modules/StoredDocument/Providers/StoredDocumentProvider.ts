import {
	StoredDocument,
	StoredDocumentDto,
	StoredDocumentHash,
	StoredDocumentId,
} from "@backend/Modules/StoredDocument/Entities/StoredDocument";
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

	public async findByHash(hash: StoredDocumentHash): Promise<StoredDocument> {
		const result = await this.database.query(
			"SELECT * FROM stored_documents WHERE hash = $hash",
			{ hash: hash },
			StoredDocumentDto.asserterArray,
		);

		if (result.length === 0) {
			throw new NotFoundException("Stored document not found");
		}

		return StoredDocument.fromDto(result[0]);
	}
}

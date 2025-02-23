import { VirtualDocument, VirtualDocumentDto, VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { IPostgresDatabaseProvider } from "@backend/Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class VirtualDocumentProvider {
	public constructor(@Inject(IPostgresDatabaseProvider) private readonly database: IPostgresDatabaseProvider) {}

	public async create(document: VirtualDocument): Promise<void> {
		const dto = VirtualDocument.toDto(document);
		await this.database.insert([dto], ["id", "name", "description", "created_at", "updated_at", "deleted_at", "type"], "virtual_documents");
	}

	public async findById(id: VirtualDocumentId): Promise<VirtualDocument> {
		const result = await this.database.query(
			"SELECT * FROM virtual_documents WHERE id = $/id/",
			{ id: id },
			VirtualDocumentDto.asserterArray,
		);

		if (result.length === 0) {
			throw new NotFoundException("Stored document not found");
		}

		return VirtualDocument.fromDto(result[0]);
	}
}

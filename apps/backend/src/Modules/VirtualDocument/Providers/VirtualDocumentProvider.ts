import { Inject, NotFoundException } from "@nestjs/common";
import { IVirtualDocumentProvider } from "Modules/VirtualDocument/Contracts/IVirtualDocumentProvider";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualFolder } from "Modules/VirtualFolder/Entities/VirtualFolder";
import { IPostgresDatabaseProvider } from "Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";

export class VirtualDocumentProvider implements IVirtualDocumentProvider.Interface {
	public constructor(@Inject(IPostgresDatabaseProvider) private readonly database: IPostgresDatabaseProvider) {}

	public async create(document: VirtualDocument.Entity): Promise<void> {
		const dto = VirtualDocument.Entity.toDto(document);
		await this.database.insert([dto], ["id", "name", "description", "created_at", "updated_at", "deleted_at", "type"], "virtual_documents");
	}

	public async findById(id: VirtualDocument.Types.IdType): Promise<VirtualDocument.Entity> {
		const result = await this.database.query(
			"SELECT * FROM virtual_documents WHERE id = $/id/",
			{ id: id },
			VirtualDocument.Types.Dto.asserterArray,
		);

		if (result.length === 0) {
			throw new NotFoundException("Stored document not found");
		}

		return VirtualDocument.Entity.fromDto(result[0]);
	}

	public async findByIds(ids: VirtualDocument.Types.IdType[]): Promise<VirtualDocument.Entity[]> {
		const result = await this.database.query(
			"SELECT * FROM virtual_documents WHERE id IN ($/ids:csv/) ORDER BY created_at DESC",
			{ ids: ids },
			VirtualDocument.Types.Dto.asserterArray,
		);

		if (result.length === 0) {
			throw new NotFoundException("Stored document not found");
		}

		return result.map(VirtualDocument.Entity.fromDto);
	}

	public async findForVirtualFolder(
		folderIds: VirtualFolder.Types.IdType[],
	): Promise<IVirtualDocumentProvider.Types.VirtualDocumentWithMostRecentStoredDocument.QueryResult[]> {
		const result = await this.database.query(
			`
			SELECT vd.*, vfvds.virtual_folder_id
			FROM virtual_documents vd
			INNER JOIN virtual_folders_virtual_documents AS vfvds ON vfvds.virtual_document_id = vd.id
			WHERE vfvds.virtual_folder_id IN ($/virtual_folder_ids:csv/)
			ORDER BY vd.created_at DESC`,
			{ virtual_folder_ids: folderIds },
			IVirtualDocumentProvider.Types.VirtualDocumentWithMostRecentStoredDocument.QueryResult.asserterArray,
		);

		return result;
	}
}

import { GetVirtualDocumentsWithMostRecentStoredDocumentsActionTypes } from "@backend/Modules/VirtualDocument/Actions/GetVirtualDocumentsWithMostRecentStoredDocumentsAction";
import { IVirtualDocumentProvider } from "@backend/Modules/VirtualDocument/Contracts/IVirtualDocumentProvider";
import { VirtualDocument, VirtualDocumentDto, VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualFolderId } from "@backend/Modules/VirtualFolder/Entities/VirtualFolder";
import { IPostgresDatabaseProvider } from "@backend/Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";
import { Inject, NotFoundException } from "@nestjs/common";

export class VirtualDocumentProvider implements IVirtualDocumentProvider {
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

	public async findByIds(ids: VirtualDocumentId[]): Promise<VirtualDocument[]> {
		const result = await this.database.query(
			"SELECT * FROM virtual_documents WHERE id IN ($/ids:csv/) ORDER BY created_at DESC",
			{ ids: ids },
			VirtualDocumentDto.asserterArray,
		);

		if (result.length === 0) {
			throw new NotFoundException("Stored document not found");
		}

		return result.map(VirtualDocument.fromDto);
	}

	public async findForVirtualFolder(
		folderIds: VirtualFolderId[],
	): Promise<GetVirtualDocumentsWithMostRecentStoredDocumentsActionTypes.QueryResult[]> {
		const result = await this.database.query(
			`
			SELECT vd.*, vfvds.virtual_folder_id
			FROM virtual_documents vd
			INNER JOIN virtual_folders_virtual_documents AS vfvds ON vfvds.virtual_document_id = vd.id
			WHERE vfvds.virtual_folder_id IN ($/virtual_folder_ids:csv/)
			ORDER BY vd.created_at DESC`,
			{ virtual_folder_ids: folderIds },
			GetVirtualDocumentsWithMostRecentStoredDocumentsActionTypes.QueryResult.asserterArray,
		);

		return result;
	}
}

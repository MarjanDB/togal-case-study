import { Inject, NotFoundException } from "@nestjs/common";
import { IVirtualDocumentProvider } from "Modules/VirtualDocument/Contracts/IVirtualDocumentProvider";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualFolder } from "Modules/VirtualFolder/Entities/VirtualFolder";
import { IColumnConfig } from "pg-promise";
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

	public async findAllWithAssociatedStoredDocuments(
		ids: VirtualDocument.Types.IdType[],
	): Promise<IVirtualDocumentProvider.Types.VirtualDocumentWithAssociatedStoredDocuments.QueryResult[]> {
		const result = await this.database.query(
			`SELECT
				vd.*,
				sd.id AS stored_document_id,
				sd.hash AS stored_document_hash,
				sd.stored_at AS stored_document_stored_at,
				sd.original_file_name AS stored_document_original_file_name
			FROM virtual_documents vd
			INNER JOIN virtual_documents_stored_documents AS vdsd ON vdsd.virtual_document_id = vd.id
			INNER JOIN stored_documents sd ON sd.id = vdsd.stored_document_id
			WHERE vd.id IN ($/virtual_document_ids:csv/)
			ORDER BY sd.stored_at DESC`,
			{ virtual_document_ids: ids },
			IVirtualDocumentProvider.Types.VirtualDocumentWithAssociatedStoredDocuments.QueryResult.asserterArray,
		);

		return result;
	}

	public async update(documents: (Pick<VirtualDocument.Types.Dto, "id"> & Partial<VirtualDocument.Types.Dto>)[]): Promise<void> {
		const columns: Record<keyof VirtualDocument.Types.Dto, IColumnConfig<unknown>> = {
			id: {
				name: "id",
				cnd: true,
				cast: "uuid",
			},
			name: {
				name: "name",
				cast: "text",
			},
			description: {
				name: "description",
				cast: "text",
			},
			created_at: {
				name: "created_at",
				cast: "timestamp without time zone",
			},
			updated_at: {
				name: "updated_at",
				cast: "timestamp without time zone",
			},
			deleted_at: {
				name: "deleted_at",
				cast: "timestamp without time zone",
			},
			type: {
				name: "type",
				cast: "text",
			},
		};

		// Naive implementation, but should work for this case
		const props = Object.keys(documents[0]).filter((prop): prop is keyof VirtualDocument.Types.Dto => prop in columns);
		const columnsSets = props.filter((prop) => prop !== "id").map((prop) => columns[prop]);

		await this.database.update(documents, [columns["id"]], columnsSets, "virtual_documents");
	}
}

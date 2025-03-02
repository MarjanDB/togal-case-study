import { Inject, NotFoundException } from "@nestjs/common";
import { IVirtualFolderProvider } from "Modules/VirtualFolder/Contracts/IVirtualFolderProvider";
import { VirtualFolder } from "Modules/VirtualFolder/Entities/VirtualFolder";
import { IColumnConfig } from "pg-promise";
import { IPostgresDatabaseProvider } from "Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";

export class VirtualFolderProvider implements IVirtualFolderProvider.Interface {
	public constructor(@Inject(IPostgresDatabaseProvider) private readonly database: IPostgresDatabaseProvider) {}

	public async create(folder: VirtualFolder.Entity): Promise<void> {
		const dto = VirtualFolder.Entity.toDto(folder);
		await this.database.insert([dto], ["id", "name", "created_at", "updated_at", "deleted_at"], "virtual_folders");
	}

	public async findById(id: VirtualFolder.Types.IdType): Promise<VirtualFolder.Entity> {
		const result = await this.database.query(
			"SELECT * FROM virtual_folders WHERE id = $/id/",
			{ id: id },
			VirtualFolder.Types.Dto.asserterArray,
		);

		if (result.length === 0) {
			throw new NotFoundException("Virtual folder not found");
		}

		return VirtualFolder.Entity.fromDto(result[0]);
	}

	public async findByIds(ids: VirtualFolder.Types.IdType[]): Promise<VirtualFolder.Entity[]> {
		const result = await this.database.query(
			"SELECT * FROM virtual_folders WHERE id IN ($/ids:csv/) ORDER BY created_at DESC",
			{ ids: ids },
			VirtualFolder.Types.Dto.asserterArray,
		);

		if (result.length === 0) {
			throw new NotFoundException("Virtual folder not found");
		}

		return result.map(VirtualFolder.Entity.fromDto);
	}

	public async findAll(): Promise<VirtualFolder.Entity[]> {
		const result = await this.database.query(
			"SELECT * FROM virtual_folders ORDER BY created_at DESC",
			{},
			VirtualFolder.Types.Dto.asserterArray,
		);

		return result.map(VirtualFolder.Entity.fromDto);
	}

	public async findAllWithAssociatedVirtualDocuments(): Promise<
		IVirtualFolderProvider.Types.VirtualFolderWithAssociatedVirtualDocumentsQuery[]
	> {
		const result = await this.database.query(
			`
			SELECT vf.*, vfvd.virtual_document_id
			FROM virtual_folders vf
			LEFT JOIN virtual_folders_virtual_documents vfvd ON vfvd.virtual_folder_id = vf.id
			ORDER BY vf.created_at DESC
			`,
			{},
			IVirtualFolderProvider.Types.VirtualFolderWithAssociatedVirtualDocumentsQuery.asserterArray,
		);

		return result;
	}

	public async findbyIdsWithAssociatedVirtualDocuments(
		ids: VirtualFolder.Types.IdType[],
	): Promise<IVirtualFolderProvider.Types.VirtualFolderWithAssociatedVirtualDocumentsQuery[]> {
		const result = await this.database.query(
			`
			SELECT vf.*, vfvd.virtual_document_id
			FROM virtual_folders vf
			LEFT JOIN virtual_folders_virtual_documents vfvd ON vfvd.virtual_folder_id = vf.id
			WHERE vf.id IN ($/ids:csv/)
			ORDER BY vf.created_at DESC
			`,
			{ ids: ids },
			IVirtualFolderProvider.Types.VirtualFolderWithAssociatedVirtualDocumentsQuery.asserterArray,
		);

		return result;
	}

	public async update(documents: (Pick<VirtualFolder.Types.Dto, "id"> & Partial<VirtualFolder.Types.Dto>)[]): Promise<void> {
		const columns: Record<keyof VirtualFolder.Types.Dto, IColumnConfig<unknown>> = {
			id: {
				name: "id",
				cnd: true,
				cast: "uuid",
			},
			name: {
				name: "name",
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
		};

		// Naive implementation, but should work for this case
		const props = Object.keys(documents[0]).filter((prop): prop is keyof VirtualFolder.Types.Dto => prop in columns);
		const columnsSets = props.filter((prop) => prop !== "id").map((prop) => columns[prop]);

		await this.database.update(documents, [columns["id"]], columnsSets, "virtual_documents");
	}
}

import { Inject, NotFoundException } from "@nestjs/common";
import { IVirtualFolderProvider } from "Modules/VirtualFolder/Contracts/IVirtualFolderProvider";
import { VirtualFolder } from "Modules/VirtualFolder/Entities/VirtualFolder";
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
}

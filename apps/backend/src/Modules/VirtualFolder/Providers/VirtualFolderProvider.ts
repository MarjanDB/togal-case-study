import { IVirtualFolderProvider } from "@backend/Modules/VirtualFolder/Contracts/IVirtualFolderProvider";
import { VirtualFolder, VirtualFolderDto, VirtualFolderId } from "@backend/Modules/VirtualFolder/Entities/VirtualFolder";
import { IPostgresDatabaseProvider } from "@backend/Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";
import { Inject, NotFoundException } from "@nestjs/common";

export class VirtualFolderProvider implements IVirtualFolderProvider {
	public constructor(@Inject(IPostgresDatabaseProvider) private readonly database: IPostgresDatabaseProvider) {}

	public async create(folder: VirtualFolder): Promise<void> {
		const dto = VirtualFolder.toDto(folder);
		await this.database.insert([dto], ["id", "name", "created_at", "updated_at", "deleted_at"], "virtual_folders");
	}

	public async findById(id: VirtualFolderId): Promise<VirtualFolder> {
		const result = await this.database.query("SELECT * FROM virtual_folders WHERE id = $/id/", { id: id }, VirtualFolderDto.asserterArray);

		if (result.length === 0) {
			throw new NotFoundException("Virtual folder not found");
		}

		return VirtualFolder.fromDto(result[0]);
	}

	public async findByIds(ids: VirtualFolderId[]): Promise<VirtualFolder[]> {
		const result = await this.database.query(
			"SELECT * FROM virtual_folders WHERE id IN ($/ids:csv/) ORDER BY created_at DESC",
			{ ids: ids },
			VirtualFolderDto.asserterArray,
		);

		if (result.length === 0) {
			throw new NotFoundException("Virtual folders not found");
		}

		return result.map(VirtualFolder.fromDto);
	}

	public async findAll(): Promise<VirtualFolder[]> {
		const result = await this.database.query("SELECT * FROM virtual_folders ORDER BY created_at DESC", {}, VirtualFolderDto.asserterArray);

		return result.map(VirtualFolder.fromDto);
	}
}

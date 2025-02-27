import { Nominal } from "Utils/NominalType";
import { UUID } from "crypto";
import { DateTime } from "luxon";
import typia from "typia";

export type VirtualFolderId = Nominal<UUID, "VirtualFolderId">;

export class VirtualFolder {
	public constructor(
		public readonly id: VirtualFolderId,
		public readonly name: string,
		public readonly createdAt: DateTime,
		public readonly updatedAt: DateTime,
		public readonly deletedAt: DateTime | null,
	) {}

	public static fromDto(dto: VirtualFolderDto): VirtualFolder {
		return new VirtualFolder(dto.id, dto.name, dto.created_at, dto.updated_at, dto.deleted_at);
	}

	public static toDto(folder: VirtualFolder): VirtualFolderDto {
		return {
			id: folder.id,
			name: folder.name,
			created_at: folder.createdAt,
			updated_at: folder.updatedAt,
			deleted_at: folder.deletedAt,
		};
	}
}

export interface VirtualFolderDto {
	id: VirtualFolderId;
	name: string;
	created_at: DateTime;
	updated_at: DateTime;
	deleted_at: DateTime | null;
}

export const VirtualFolderDto = {
	asserter: typia.createAssert<VirtualFolderDto>(),
	asserterArray: typia.createAssert<VirtualFolderDto[]>(),
};

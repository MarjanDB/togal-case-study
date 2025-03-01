import { Nominal } from "Utils/NominalType";
import { UUID } from "crypto";
import { DateTime } from "luxon";
import typia from "typia";

export namespace VirtualFolder {
	export class Entity {
		public constructor(
			public readonly id: Types.IdType,
			public readonly name: string,
			public readonly createdAt: DateTime,
			public readonly updatedAt: DateTime,
			public readonly deletedAt: DateTime | null,
		) {}

		public static fromDto(dto: Types.Dto): Entity {
			return new Entity(dto.id as Types.IdType, dto.name, dto.created_at, dto.updated_at, dto.deleted_at);
		}

		public static toDto(folder: Entity): Types.Dto {
			return {
				id: folder.id,
				name: folder.name,
				created_at: folder.createdAt,
				updated_at: folder.updatedAt,
				deleted_at: folder.deletedAt,
			};
		}
	}

	export namespace Types {
		export type IdType = Nominal<UUID, "VirtualFolderId">;

		export interface Dto {
			id: string;
			name: string;
			created_at: DateTime;
			updated_at: DateTime;
			deleted_at: DateTime | null;
		}

		export const Dto = {
			asserter: typia.createAssert<Dto>(),
			asserterArray: typia.createAssert<Dto[]>(),
		};
	}
}

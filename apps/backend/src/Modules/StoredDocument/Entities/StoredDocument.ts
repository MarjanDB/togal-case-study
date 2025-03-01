import { Nominal } from "Utils/NominalType";
import { UUID } from "crypto";
import { DateTime } from "luxon";
import typia from "typia";

export namespace StoredDocument {
	export class Entity {
		public constructor(
			public readonly id: Types.IdType,
			public readonly hash: Types.HashType,
			public readonly storedAt: DateTime,
			public readonly originalFileName: string,
			public readonly data: Uint8Array,
		) {}

		public static fromDto(dto: Types.Dto): Entity {
			return new Entity(dto.id as Types.IdType, dto.hash as Types.HashType, dto.stored_at, dto.original_file_name, dto.data);
		}

		public static toDto(document: Entity): Types.Dto {
			return {
				id: document.id,
				hash: document.hash,
				stored_at: document.storedAt,
				original_file_name: document.originalFileName,
				data: document.data,
			};
		}
	}

	export namespace Types {
		export type IdType = Nominal<UUID, "StoredDocumentId">;

		export type HashType = Nominal<string, "StoredDocumentHash">;

		export type Dto = {
			id: string;
			hash: string;
			stored_at: DateTime;
			original_file_name: string;
			data: Uint8Array;
		};

		export const Dto = {
			asserter: typia.createAssert<Dto>(),
			asserterArray: typia.createAssert<Dto[]>(),
		};
	}
}

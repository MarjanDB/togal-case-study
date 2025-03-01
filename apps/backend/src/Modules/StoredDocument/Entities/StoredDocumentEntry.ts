import { StoredDocument } from "Modules/StoredDocument/Entities/StoredDocument";
import { DateTime } from "luxon";
import typia from "typia";

export namespace StoredDocumentEntry {
	export class Entity {
		public constructor(
			public readonly id: StoredDocument.Types.IdType,
			public readonly hash: StoredDocument.Types.HashType,
			public readonly storedAt: DateTime,
			public readonly originalFileName: string,
		) {}

		public static fromDto(dto: Types.Dto): Entity {
			return new Entity(
				dto.id as StoredDocument.Types.IdType,
				dto.hash as StoredDocument.Types.HashType,
				dto.stored_at,
				dto.original_file_name,
			);
		}

		public static toDto(document: Entity): Types.Dto {
			return {
				id: document.id,
				hash: document.hash,
				stored_at: document.storedAt,
				original_file_name: document.originalFileName,
			};
		}
	}

	export namespace Types {
		export type Dto = Omit<StoredDocument.Types.Dto, "data">;

		export const Dto = {
			asserter: typia.createAssert<Dto>(),
			asserterArray: typia.createAssert<Dto[]>(),
		};
	}
}

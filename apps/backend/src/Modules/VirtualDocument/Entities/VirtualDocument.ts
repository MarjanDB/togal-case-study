import { Nominal } from "Utils/NominalType";
import { UUID } from "crypto";
import { DateTime } from "luxon";
import typia from "typia";

export namespace VirtualDocument {
	export class Entity {
		public constructor(
			public readonly id: Types.IdType,
			public readonly name: string,
			public readonly description: string | null,
			public readonly createdAt: DateTime,
			public readonly updatedAt: DateTime,
			public readonly deletedAt: DateTime | null,
			public readonly type: Types.DocumentType,
		) {}

		public static fromDto(dto: Types.Dto): Entity {
			return new Entity(dto.id as Types.IdType, dto.name, dto.description, dto.created_at, dto.updated_at, dto.deleted_at, dto.type);
		}

		public static toDto(document: Entity): Types.Dto {
			return {
				id: document.id,
				name: document.name,
				description: document.description,
				created_at: document.createdAt,
				updated_at: document.updatedAt,
				deleted_at: document.deletedAt,
				type: document.type,
			};
		}
	}

	export namespace Types {
		export type IdType = Nominal<UUID, "VirtualDocumentId">;

		export type HashType = Nominal<string, "VirtualDocumentHash">;

		export interface Dto {
			id: string;
			name: string;
			description: string | null;
			created_at: DateTime;
			updated_at: DateTime;
			deleted_at: DateTime | null;
			type: DocumentType;
		}

		export const Dto = {
			asserter: typia.createAssert<Dto>(),
			asserterArray: typia.createAssert<Dto[]>(),
		};

		export const enum DocumentType {
			PDF = "pdf",
			WORD = "word",
			EXCEL = "excel",
			TEXT = "text",
		}
	}
}

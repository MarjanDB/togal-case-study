import { DateTime } from "luxon";

export namespace StoredDocumentEntry {
	export class Entity {
		constructor(
			public readonly id: string,
			public readonly storedAt: DateTime,
			public readonly originalFileName: string,
		) {}

		public static fromDto(dto: Types.Dto.StoredDocumentForVirtualDocument): Entity {
			return new Entity(dto.id, DateTime.fromISO(dto.storedAt), dto.originalFileName);
		}
	}

	export namespace Types {
		export namespace Dto {
			export type StoredDocumentForVirtualDocument = {
				id: string;
				storedAt: string;
				originalFileName: string;
			};
		}
	}
}

import { DateTime } from "luxon";
import { StoredDocumentEntry } from "./StoredDocumentEntry";
import { VirtualDocument } from "./VirtualDocument";

export namespace VirtualDocumentWithMostRecentStoredDocumentEntry {
	export class Entity {
		constructor(
			public readonly id: string,
			public readonly name: string,
			public readonly description: string | null,
			public readonly createdAt: DateTime,
			public readonly updatedAt: DateTime,
			public readonly mostRecentStoredDocumentEntry: StoredDocumentEntry.Entity,
		) {}

		public static fromDto(dto: Types.Dto.VirtualDocumentWithMostRecentStoredDocumentEntry): Entity {
			return new Entity(
				dto.id,
				dto.name,
				dto.description,
				DateTime.fromISO(dto.createdAt),
				DateTime.fromISO(dto.updatedAt),
				StoredDocumentEntry.Entity.fromDto(dto.mostRecentStoredDocumentEntry),
			);
		}
	}
	export namespace Types {
		export namespace Dto {
			export type VirtualDocumentWithMostRecentStoredDocumentEntry = VirtualDocument.Types.Dto.VirtualDocument & {
				mostRecentStoredDocumentEntry: StoredDocumentEntry.Types.Dto.StoredDocumentForVirtualDocument;
			};
		}
	}
}

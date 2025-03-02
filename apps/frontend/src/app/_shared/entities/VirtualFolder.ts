import { DateTime } from "luxon";

export namespace VirtualFolder {
	export class Entity {
		constructor(
			public readonly id: string,
			public readonly name: string,
			public readonly createdAt: DateTime,
			public readonly updatedAt: DateTime,
			public readonly virtualDocumentIds: string[],
		) {}

		public static fromDto(dto: Types.Dto.VirtualFolder): Entity {
			return new Entity(dto.id, dto.name, DateTime.fromISO(dto.createdAt), DateTime.fromISO(dto.updatedAt), dto.virtualDocumentIds);
		}
	}

	export namespace Types {
		export namespace Dto {
			export type VirtualFolder = {
				id: string;
				name: string;
				createdAt: string;
				updatedAt: string;
				virtualDocumentIds: string[];
			};
		}
	}
}

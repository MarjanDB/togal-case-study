import { DateTime } from "luxon";

export namespace VirtualDocument {
	export class Entity {
		constructor(
			public readonly id: string,
			public readonly name: string,
			public readonly description: string | null,
			public readonly createdAt: DateTime,
			public readonly updatedAt: DateTime,
		) {}

		public static fromDto(dto: Types.Dto.VirtualDocument): Entity {
			return new Entity(dto.id, dto.name, dto.description, DateTime.fromISO(dto.createdAt), DateTime.fromISO(dto.updatedAt));
		}
	}

	export namespace Types {
		export namespace Dto {
			export type VirtualDocument = {
				id: string;
				name: string;
				description: string | null;
				createdAt: string;
				updatedAt: string;
			};
		}
	}
}

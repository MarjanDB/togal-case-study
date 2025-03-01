import { StoredDocument } from "Modules/StoredDocument/Entities/StoredDocument";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";
import typia from "typia";

export namespace VirtualDocumentStoredDocument {
	export class Entity {
		public constructor(
			public readonly virtualDocumentId: VirtualDocument.Types.IdType,
			public readonly storedDocumentId: StoredDocument.Types.IdType,
		) {}

		public static fromDto(dto: Types.Dto): Entity {
			return new Entity(dto.virtual_document_id as VirtualDocument.Types.IdType, dto.stored_document_id as StoredDocument.Types.IdType);
		}

		public static toDto(document: Entity): Types.Dto {
			return {
				virtual_document_id: document.virtualDocumentId,
				stored_document_id: document.storedDocumentId,
			};
		}
	}

	export namespace Types {
		export interface Dto {
			virtual_document_id: string;
			stored_document_id: string;
		}

		export const Dto = {
			asserter: typia.createAssert<Dto>(),
			asserterArray: typia.createAssert<Dto[]>(),
		};
	}
}

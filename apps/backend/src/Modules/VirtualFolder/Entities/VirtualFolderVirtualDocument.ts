import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualFolder } from "Modules/VirtualFolder/Entities/VirtualFolder";
import typia from "typia";

export namespace VirtualFolderVirtualDocument {
	export class Entity {
		public constructor(
			public readonly virtualFolderId: VirtualFolder.Types.IdType,
			public readonly virtualDocumentId: VirtualDocument.Types.IdType,
		) {}

		public static fromDto(dto: Types.Dto): Entity {
			return new Entity(dto.virtual_folder_id as VirtualFolder.Types.IdType, dto.virtual_document_id as VirtualDocument.Types.IdType);
		}

		public static toDto(document: Entity): Types.Dto {
			return {
				virtual_folder_id: document.virtualFolderId,
				virtual_document_id: document.virtualDocumentId,
			};
		}
	}

	export namespace Types {
		export interface Dto {
			virtual_folder_id: string;
			virtual_document_id: string;
		}

		export const Dto = {
			asserter: typia.createAssert<Dto>(),
			asserterArray: typia.createAssert<Dto[]>(),
		};
	}
}

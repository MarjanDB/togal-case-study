import { Injectable } from "@nestjs/common";
import { StoredDocument } from "Modules/StoredDocument/Entities/StoredDocument";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualFolder } from "Modules/VirtualFolder/Entities/VirtualFolder";
import typia from "typia";

export namespace IVirtualDocumentProvider {
	@Injectable()
	export abstract class Interface {
		abstract create(document: VirtualDocument.Entity): Promise<void>;
		abstract findById(id: VirtualDocument.Types.IdType): Promise<VirtualDocument.Entity>;
		abstract findByIds(ids: VirtualDocument.Types.IdType[]): Promise<VirtualDocument.Entity[]>;
		abstract findForVirtualFolder(
			folderIds: VirtualFolder.Types.IdType[],
		): Promise<Types.VirtualDocumentWithMostRecentStoredDocument.QueryResult[]>;
		abstract update(document: (Pick<VirtualDocument.Types.Dto, "id"> & Partial<VirtualDocument.Types.Dto>)[]): Promise<void>;
	}

	export namespace Types {
		export namespace VirtualDocumentWithMostRecentStoredDocument {
			export type QueryResult = VirtualDocument.Types.Dto & {
				most_recent_stored_document: StoredDocument.Types.Dto["id"];
			};

			export const QueryResult = {
				asserter: typia.createAssert<QueryResult>(),
				asserterArray: typia.createAssert<QueryResult[]>(),
			};
		}
	}
}

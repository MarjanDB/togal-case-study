import { Injectable } from "@nestjs/common";
import { StoredDocument } from "Modules/StoredDocument/Entities/StoredDocument";
import { StoredDocumentEntry } from "Modules/StoredDocument/Entities/StoredDocumentEntry";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";
import typia from "typia";

export namespace IStoredDocumentProvider {
	@Injectable()
	export abstract class Interface {
		abstract create(document: StoredDocument.Entity): Promise<void>;
		abstract findById(id: StoredDocument.Types.IdType): Promise<StoredDocument.Entity>;
		abstract findByHash(hash: StoredDocument.Types.HashType): Promise<StoredDocument.Entity[]>;
		abstract findForVirtualDocuments(virtualDocumentIds: VirtualDocument.Types.IdType[]): Promise<Types.FindForVirtualDocuments[]>;

		abstract findMostRecentStoredDocumentEntriesForVirtualDocuments(
			virtualDocumentIds: VirtualDocument.Types.IdType[],
		): Promise<Types.FindMostRecentStoredDocumentEntriesForVirtualDocuments[]>;
	}

	export namespace Types {
		export type FindForVirtualDocuments = StoredDocument.Types.DtoWithData & {
			virtual_document_id: string;
		};

		export const FindForVirtualDocuments = {
			asserter: typia.createAssert<FindForVirtualDocuments>(),
			asserterArray: typia.createAssert<FindForVirtualDocuments[]>(),
		};

		export type FindMostRecentStoredDocumentEntriesForVirtualDocuments = StoredDocumentEntry.Types.Dto & {
			virtual_document_id: string;
			ranked: number;
		};

		export const FindMostRecentStoredDocumentEntriesForVirtualDocuments = {
			asserter: typia.createAssert<FindMostRecentStoredDocumentEntriesForVirtualDocuments>(),
			asserterArray: typia.createAssert<FindMostRecentStoredDocumentEntriesForVirtualDocuments[]>(),
		};
	}
}

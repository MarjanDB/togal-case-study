import { StoredDocument, StoredDocumentDto, StoredDocumentId } from "@backend/Modules/StoredDocument/Entities/StoredDocument";
import { StoredDocumentProvider } from "@backend/Modules/StoredDocument/Providers/StoredDocumentProvider";
import { VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { Inject, Injectable } from "@nestjs/common";
import radash from "radashi";
import typia from "typia";

@Injectable()
export class FindStoredDocumentsBelongingToVirtualDocumentsAction {
	public constructor(@Inject(StoredDocumentProvider) private readonly storedDocumentProvider: StoredDocumentProvider) {}

	public async execute(
		virtualDocumentIds: VirtualDocumentId[],
	): Promise<FindStoredDocumentsBelongingToVirtualDocumentsActionTypes.VirtualDocumentLookup> {
		const result = await this.storedDocumentProvider.findForVirtualDocuments(virtualDocumentIds);

		const resultsWithStoredDocuments = result.map((item) => ({
			virtual_document_stored_document_id: item.virtual_document_stored_document_id,
			storedDocument: StoredDocument.fromDto(item),
		}));

		const storedDocumentsGroupedByVirtualDocumentId = radash.group(
			resultsWithStoredDocuments,
			(item) => item.virtual_document_stored_document_id,
		);

		const lookup: FindStoredDocumentsBelongingToVirtualDocumentsActionTypes.VirtualDocumentLookup = {};

		for (const [virtualDocumentId, storedDocuments] of Object.entries(storedDocumentsGroupedByVirtualDocumentId)) {
			lookup[virtualDocumentId as VirtualDocumentId] = {};

			for (const storedDocument of storedDocuments ?? []) {
				lookup[virtualDocumentId as VirtualDocumentId][storedDocument.storedDocument.id] = storedDocument.storedDocument;
			}
		}

		return lookup;
	}
}

export namespace FindStoredDocumentsBelongingToVirtualDocumentsActionTypes {
	export type StoredDocumentLookup = Record<StoredDocumentId, StoredDocument>;

	export type VirtualDocumentLookup = Record<VirtualDocumentId, StoredDocumentLookup>;

	export interface QueryResult extends StoredDocumentDto {
		virtual_document_stored_document_id: VirtualDocumentId;
	}

	export const QueryResult = {
		asserter: typia.createAssert<QueryResult>(),
		asserterArray: typia.createAssert<QueryResult[]>(),
	};
}

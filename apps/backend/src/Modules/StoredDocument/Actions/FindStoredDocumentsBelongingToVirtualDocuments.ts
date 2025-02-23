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

		const storedDocumentsGroupedByVirtualDocumentId = radash.group(result, (item) => item.virtual_document_stored_document_id);

		const lookup: FindStoredDocumentsBelongingToVirtualDocumentsActionTypes.VirtualDocumentLookup = Object.fromEntries(
			Object.entries(storedDocumentsGroupedByVirtualDocumentId).map(([virtualDocumentId, storedDocuments]) => [
				virtualDocumentId,
				radash.group(storedDocuments ?? [], (item) => item.id),
			]),
		) as unknown as FindStoredDocumentsBelongingToVirtualDocumentsActionTypes.VirtualDocumentLookup;
		// .group has an optional value pair type which causes issues

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

import { IStoredDocumentProvider } from "@backend/Modules/StoredDocument/Contracts/IStoredDocumentProvider";
import { StoredDocument, StoredDocumentDto } from "@backend/Modules/StoredDocument/Entities/StoredDocument";
import { VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { Inject, Injectable } from "@nestjs/common";
import typia from "typia";

@Injectable()
export class FindMostRecentStoredDocumentBelongingToVirtualDocumentAction {
	public constructor(@Inject(IStoredDocumentProvider) private readonly storedDocumentProvider: IStoredDocumentProvider) {}

	public async execute(
		virtualDocumentIds: VirtualDocumentId[],
	): Promise<FindMostRecentStoredDocumentBelongingToVirtualDocumentActionTypes.VirtualDocumentLookup> {
		const result = await this.storedDocumentProvider.findMostRecentForVirtualDocuments(virtualDocumentIds);

		const resultsWithStoredDocuments = result.map((item) => ({
			virtual_document_id: item.virtual_document_id,
			storedDocument: StoredDocument.fromDto(item),
		}));

		const lookup: FindMostRecentStoredDocumentBelongingToVirtualDocumentActionTypes.VirtualDocumentLookup = {};

		for (const item of resultsWithStoredDocuments) {
			lookup[item.virtual_document_id as VirtualDocumentId] = item.storedDocument;
		}

		return lookup;
	}
}

export namespace FindMostRecentStoredDocumentBelongingToVirtualDocumentActionTypes {
	export type VirtualDocumentLookup = Record<VirtualDocumentId, StoredDocument>;

	export interface QueryResult extends StoredDocumentDto {
		virtual_document_id: VirtualDocumentId;
		ranked: number;
	}

	export const QueryResult = {
		asserter: typia.createAssert<QueryResult>(),
		asserterArray: typia.createAssert<QueryResult[]>(),
	};
}

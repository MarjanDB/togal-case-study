import { IStoredDocumentProvider } from "@backend/Modules/StoredDocument/Contracts/IStoredDocumentProvider";
import { StoredDocument } from "@backend/Modules/StoredDocument/Entities/StoredDocument";
import { VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction {
	public constructor(@Inject(IStoredDocumentProvider) private readonly storedDocumentProvider: IStoredDocumentProvider) {}

	public async execute(
		virtualDocumentIds: VirtualDocumentId[],
	): Promise<FindMostRecentStoredDocumentBelongingToVirtualDocumentsActionTypes.VirtualDocumentLookup> {
		const result = await this.storedDocumentProvider.findMostRecentForVirtualDocuments(virtualDocumentIds);

		const resultsWithStoredDocuments = result.map((item) => ({
			virtualDocumentId: item.virtual_document_id,
			storedDocument: StoredDocument.fromDto(item),
		}));

		const lookup: FindMostRecentStoredDocumentBelongingToVirtualDocumentsActionTypes.VirtualDocumentLookup = {};

		for (const item of resultsWithStoredDocuments) {
			lookup[item.virtualDocumentId as VirtualDocumentId] = item.storedDocument;
		}

		return lookup;
	}
}

export namespace FindMostRecentStoredDocumentBelongingToVirtualDocumentsActionTypes {
	export type VirtualDocumentLookup = Record<VirtualDocumentId, StoredDocument>;
}

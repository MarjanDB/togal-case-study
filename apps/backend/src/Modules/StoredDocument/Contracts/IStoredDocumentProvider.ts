import { FindMostRecentStoredDocumentBelongingToVirtualDocumentActionTypes } from "@backend/Modules/StoredDocument/Actions/FindMostRecentStoredDocumentBelongingToVirtualDocumentAction";
import { FindStoredDocumentsBelongingToVirtualDocumentsActionTypes } from "@backend/Modules/StoredDocument/Actions/FindStoredDocumentsBelongingToVirtualDocumentsAction";
import { StoredDocument, StoredDocumentHash, StoredDocumentId } from "@backend/Modules/StoredDocument/Entities/StoredDocument";
import { VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class IStoredDocumentProvider {
	abstract create(document: StoredDocument): Promise<void>;
	abstract findById(id: StoredDocumentId): Promise<StoredDocument>;
	abstract findByHash(hash: StoredDocumentHash): Promise<StoredDocument[]>;
	abstract findForVirtualDocuments(
		virtualDocumentIds: VirtualDocumentId[],
	): Promise<FindStoredDocumentsBelongingToVirtualDocumentsActionTypes.QueryResult[]>;

	abstract findMostRecentForVirtualDocuments(
		virtualDocumentIds: VirtualDocumentId[],
	): Promise<FindMostRecentStoredDocumentBelongingToVirtualDocumentActionTypes.QueryResult[]>;
}

import {
	StoredDocument,
	StoredDocumentDto,
	StoredDocumentHash,
	StoredDocumentId,
} from "@backend/Modules/StoredDocument/Entities/StoredDocument";
import { VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { Injectable } from "@nestjs/common";
import typia from "typia";

@Injectable()
export abstract class IStoredDocumentProvider {
	abstract create(document: StoredDocument): Promise<void>;
	abstract findById(id: StoredDocumentId): Promise<StoredDocument>;
	abstract findByHash(hash: StoredDocumentHash): Promise<StoredDocument[]>;
	abstract findForVirtualDocuments(virtualDocumentIds: VirtualDocumentId[]): Promise<IStoredDocumentProviderTypes.FindForVirtualDocuments[]>;

	abstract findMostRecentForVirtualDocuments(
		virtualDocumentIds: VirtualDocumentId[],
	): Promise<IStoredDocumentProviderTypes.FindMostRecentForVirtualDocuments[]>;
}

export namespace IStoredDocumentProviderTypes {
	export interface FindForVirtualDocuments extends StoredDocumentDto {
		virtual_document_id: VirtualDocumentId;
	}

	export const FindForVirtualDocuments = {
		asserter: typia.createAssert<FindForVirtualDocuments>(),
		asserterArray: typia.createAssert<FindForVirtualDocuments[]>(),
	};

	export interface FindMostRecentForVirtualDocuments extends Exclude<StoredDocumentDto, ["data", "hash"]> {
		virtual_document_id: VirtualDocumentId;
		ranked: number;
	}

	export const FindMostRecentForVirtualDocuments = {
		asserter: typia.createAssert<FindMostRecentForVirtualDocuments>(),
		asserterArray: typia.createAssert<FindMostRecentForVirtualDocuments[]>(),
	};
}

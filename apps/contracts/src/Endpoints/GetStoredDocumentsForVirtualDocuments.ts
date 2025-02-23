import { DateTime } from "luxon";

export namespace GetStoredDocumentsForVirtualDocuments {
	export interface GetParameters {
		virtualDocumentId: string;
	}

	export interface Response {
		storedDocuments: StoredDocumentForVirtualDocument[];
	}

	export interface StoredDocumentForVirtualDocument {
		id: string;
		storedAt: DateTime;
		originalFileName: string;
		virtualDocumentId: string;
	}
}

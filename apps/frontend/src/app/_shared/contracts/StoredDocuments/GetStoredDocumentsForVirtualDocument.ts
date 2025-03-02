export namespace GetStoredDocumentsForVirtualDocument {
	export type Parameters = {
		virtualDocumentId: string;
	};

	export type Response = {
		storedDocuments: StoredDocumentForVirtualDocument[];
	};

	export type StoredDocumentForVirtualDocument = {
		id: string;
		storedAt: string;
		originalFileName: string;
		virtualDocumentId: string;
	};
}

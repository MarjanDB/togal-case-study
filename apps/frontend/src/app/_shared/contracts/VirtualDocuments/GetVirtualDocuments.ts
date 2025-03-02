export namespace GetVirtualDocuments {
	export type Parameters = {
		virtualDocumentIds: string[];
	};

	export type Response = {
		virtualDocuments: VirtualDocument[];
	};

	export type MostRecentStoredDocument = {
		id: string;
		storedAt: string;
		originalFileName: string;
	};

	export type VirtualDocument = {
		id: string;
		name: string;
		description: string | null;
		createdAt: string;
		updatedAt: string;
		mostRecentStoredDocument: MostRecentStoredDocument;
	};
}

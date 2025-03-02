export namespace AddVirtualDocumentToVirtualFolder {
	export type Parameters = {
		virtualFolderId: string;
		virtualDocumentIds: string[];
	};

	export type Response = {
		id: string;
		name: string;
		createdAt: string;
		updatedAt: string;
		virtualDocumentIds: string[];
	};
}

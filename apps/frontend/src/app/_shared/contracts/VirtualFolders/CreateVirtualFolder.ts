export namespace CreateVirtualFolder {
	export type Parameters = {
		name: string;
	};

	export type Response = {
		id: string;
		name: string;
		createdAt: string;
		updatedAt: string;
		virtualDocumentIds: string[];
	};
}

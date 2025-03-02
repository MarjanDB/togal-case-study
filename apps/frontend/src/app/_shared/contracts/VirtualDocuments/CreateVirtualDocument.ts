export namespace CreateVirtualDocument {
	export type Parameters = {
		name: string;
		description: string | null;
		virtualFolderId: string;
		file: any; // Replacing MemoryStoredFile type
	};

	export type AssociatedStoredDocumentEntry = {
		id: string;
		storedAt: string;
		originalFileName: string;
	};

	export type Response = {
		id: string;
		name: string;
		description: string | null;
		createdAt: string;
		updatedAt: string;
		associatedStoredDocumentEntry: AssociatedStoredDocumentEntry;
	};
}

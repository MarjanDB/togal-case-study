export namespace UploadAdditionalFileToVirtualDocument {
	export type Parameters = {
		virtualDocumentId: string;
		file: File;
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

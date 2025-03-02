export namespace GetVirtualFolders {
	export type Response = {
		virtualFolders: VirtualFolder[];
	};

	export type VirtualFolder = {
		id: string;
		name: string;
		createdAt: string;
		updatedAt: string;
		virtualDocumentIds: string[];
	};
}

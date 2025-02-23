import { DateTime } from "luxon";

export namespace GetVirtualDocuments {
	export interface GetParameters {
		virtualFolderId: string;
	}

	export interface Response {
		virtualDocuments: VirtualDocument[];
	}

	export interface VirtualDocument {
		id: string;
		name: string;
		description: string | null;
		createdAt: DateTime;
		updatedAt: DateTime;
		type: string;
		mostRecentStoredDocument: {
			id: string;
			storedAt: DateTime;
			originalFileName: string;
		};
	}
}

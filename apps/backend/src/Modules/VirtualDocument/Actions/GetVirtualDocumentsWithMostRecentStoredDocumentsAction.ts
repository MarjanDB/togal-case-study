import { FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction } from "@backend/Modules/StoredDocument/Actions/FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction";
import { StoredDocument } from "@backend/Modules/StoredDocument/Entities/StoredDocument";
import { IVirtualDocumentProvider } from "@backend/Modules/VirtualDocument/Contracts/IVirtualDocumentProvider";
import { VirtualDocument } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualFolderId } from "@backend/Modules/VirtualFolder/Entities/VirtualFolder";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetVirtualDocumentsWithMostRecentStoredDocumentsAction {
	public constructor(
		@Inject(FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction)
		private readonly findMostRecentStoredDocumentBelongingToVirtualDocumentAction: FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction,
		@Inject(IVirtualDocumentProvider)
		private readonly virtualDocumentProvider: IVirtualDocumentProvider,
	) {}

	public async execute(
		virtualFolderId: VirtualFolderId,
	): Promise<GetVirtualDocumentsWithMostRecentStoredDocumentsActionTypes.VirtualDocumentWithMostRecentStoredDocument[]> {
		const virtualDocuments = await this.virtualDocumentProvider.findForVirtualFolder([virtualFolderId]);
		const virtualDocumentIds = virtualDocuments.map((virtualDocument) => virtualDocument.id);

		const mostRecentStoredDocuments = await this.findMostRecentStoredDocumentBelongingToVirtualDocumentAction.execute(virtualDocumentIds);

		const virtualDocumentsWithMostRecentStoredDocuments: GetVirtualDocumentsWithMostRecentStoredDocumentsActionTypes.VirtualDocumentWithMostRecentStoredDocument[] =
			[];

		for (const virtualDocument of virtualDocuments) {
			virtualDocumentsWithMostRecentStoredDocuments.push({
				...virtualDocument,
				mostRecentStoredDocument: mostRecentStoredDocuments[virtualDocument.id],
				// This is potentially unsafe, since in some odd edge case it could be possible that
				// There is no matching stored document for the virtual document.
			});
		}

		return virtualDocumentsWithMostRecentStoredDocuments;
	}
}

export namespace GetVirtualDocumentsWithMostRecentStoredDocumentsActionTypes {
	export type VirtualDocumentWithMostRecentStoredDocument = VirtualDocument & {
		mostRecentStoredDocument: StoredDocument;
	};
}

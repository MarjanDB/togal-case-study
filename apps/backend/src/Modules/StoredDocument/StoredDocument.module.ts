import { Module } from "@nestjs/common";
import { CheckForExistingStoredDocumentAction } from "Modules/StoredDocument/Actions/CheckForExistingStoredDocumentAction";
import { FindMostRecentStoredDocumentBelongingToVirtualDocuments } from "Modules/StoredDocument/Actions/FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction";
import { FindStoredDocumentsBelongingToVirtualDocumentsAction } from "Modules/StoredDocument/Actions/FindStoredDocumentsBelongingToVirtualDocumentsAction";
import { StoreNewDocumentAction } from "Modules/StoredDocument/Actions/StoreNewDocumentAction";
import { IStoredDocumentProvider } from "Modules/StoredDocument/Contracts/IStoredDocumentProvider";
import { StoredDocumentProvider } from "Modules/StoredDocument/Providers/StoredDocumentProvider";

@Module({
	imports: [],
	providers: [
		{
			provide: IStoredDocumentProvider.Interface,
			useClass: StoredDocumentProvider,
		},
		CheckForExistingStoredDocumentAction.Action,
		StoreNewDocumentAction.Action,
		FindStoredDocumentsBelongingToVirtualDocumentsAction.Action,
		FindMostRecentStoredDocumentBelongingToVirtualDocuments.Action,
	],
	exports: [
		CheckForExistingStoredDocumentAction.Action,
		StoreNewDocumentAction.Action,
		FindStoredDocumentsBelongingToVirtualDocumentsAction.Action,
		FindMostRecentStoredDocumentBelongingToVirtualDocuments.Action,
	],
})
export class StoredDocumentModule {}

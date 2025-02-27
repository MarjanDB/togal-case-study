import { Module } from "@nestjs/common";
import { CheckForExistingStoredDocumentAction } from "Modules/StoredDocument/Actions/CheckForExistingStoredDocumentAction";
import { FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction } from "Modules/StoredDocument/Actions/FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction";
import { FindStoredDocumentsBelongingToVirtualDocumentsAction } from "Modules/StoredDocument/Actions/FindStoredDocumentsBelongingToVirtualDocumentsAction";
import { StoreNewDocumentAction } from "Modules/StoredDocument/Actions/StoreNewDocumentAction";
import { IStoredDocumentProvider } from "Modules/StoredDocument/Contracts/IStoredDocumentProvider";
import { StoredDocumentProvider } from "Modules/StoredDocument/Providers/StoredDocumentProvider";

@Module({
	imports: [],
	providers: [
		{
			provide: IStoredDocumentProvider,
			useClass: StoredDocumentProvider,
		},
		CheckForExistingStoredDocumentAction,
		StoreNewDocumentAction,
		FindStoredDocumentsBelongingToVirtualDocumentsAction,
		FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction,
	],
	exports: [
		CheckForExistingStoredDocumentAction,
		StoreNewDocumentAction,
		FindStoredDocumentsBelongingToVirtualDocumentsAction,
		FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction,
	],
})
export class StoredDocumentModule {}

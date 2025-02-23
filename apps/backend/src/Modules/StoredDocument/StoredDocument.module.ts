import { CheckForExistingStoredDocumentAction } from "@backend/Modules/StoredDocument/Actions/CheckForExistingStoredDocumentAction";
import { FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction } from "@backend/Modules/StoredDocument/Actions/FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction";
import { FindStoredDocumentsBelongingToVirtualDocumentsAction } from "@backend/Modules/StoredDocument/Actions/FindStoredDocumentsBelongingToVirtualDocumentsAction";
import { StoreNewDocumentAction } from "@backend/Modules/StoredDocument/Actions/StoreNewDocumentAction";
import { IStoredDocumentProvider } from "@backend/Modules/StoredDocument/Contracts/IStoredDocumentProvider";
import { StoredDocumentProvider } from "@backend/Modules/StoredDocument/Providers/StoredDocumentProvider";
import { Module } from "@nestjs/common";

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

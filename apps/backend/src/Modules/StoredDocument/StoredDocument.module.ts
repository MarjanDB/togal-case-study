import { CheckForExistingStoredDocumentAction } from "@backend/Modules/StoredDocument/Actions/CheckForExistingStoredDocumentAction";
import { FindMostRecentStoredDocumentBelongingToVirtualDocumentAction } from "@backend/Modules/StoredDocument/Actions/FindMostRecentStoredDocumentBelongingToVirtualDocumentAction";
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
		FindMostRecentStoredDocumentBelongingToVirtualDocumentAction,
	],
	exports: [
		CheckForExistingStoredDocumentAction,
		StoreNewDocumentAction,
		FindStoredDocumentsBelongingToVirtualDocumentsAction,
		FindMostRecentStoredDocumentBelongingToVirtualDocumentAction,
	],
})
export class StoredDocumentModule {}

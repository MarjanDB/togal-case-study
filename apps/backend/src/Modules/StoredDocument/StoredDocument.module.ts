import { Module } from "@nestjs/common";
import { CheckForExistingStoredDocumentByHashAction } from "Modules/StoredDocument/Actions/CheckForExistingStoredDocumentByHashAction";
import { CheckForExistingStoredDocumentByIdAction } from "Modules/StoredDocument/Actions/CheckForExistingStoredDocumentByIdAction";
import { FindMostRecentStoredDocumentBelongingToVirtualDocuments } from "Modules/StoredDocument/Actions/FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction";
import { FindStoredDocumentsBelongingToVirtualDocumentsAction } from "Modules/StoredDocument/Actions/FindStoredDocumentsBelongingToVirtualDocumentsAction";
import { GetStoredDocumentAction } from "Modules/StoredDocument/Actions/GetStoredDocumentAction";
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
		CheckForExistingStoredDocumentByHashAction.Action,
		StoreNewDocumentAction.Action,
		FindStoredDocumentsBelongingToVirtualDocumentsAction.Action,
		FindMostRecentStoredDocumentBelongingToVirtualDocuments.Action,
		CheckForExistingStoredDocumentByIdAction.Action,
		GetStoredDocumentAction.Action,
	],
	exports: [
		CheckForExistingStoredDocumentByHashAction.Action,
		StoreNewDocumentAction.Action,
		FindStoredDocumentsBelongingToVirtualDocumentsAction.Action,
		FindMostRecentStoredDocumentBelongingToVirtualDocuments.Action,
		CheckForExistingStoredDocumentByIdAction.Action,
		GetStoredDocumentAction.Action,
	],
})
export class StoredDocumentModule {}

import { Module } from "@nestjs/common";
import { StoredDocumentModule } from "Modules/StoredDocument/StoredDocument.module";
import { AssociateStoredDocumentWithVirtualDocumentAction } from "Modules/VirtualDocument/Actions/AssociateStoredDocumentWithVirtualDocumentAction";
import { CreateNewVirtualDocumentAction } from "Modules/VirtualDocument/Actions/CreateNewVirtualDocumentAction";
import { GetVirtualDocumentsAction } from "Modules/VirtualDocument/Actions/GetVirtualDocumentsAction";
import { GetVirtualDocumentsWithMostRecentStoredDocumentsAction } from "Modules/VirtualDocument/Actions/GetVirtualDocumentsWithMostRecentStoredDocumentsAction";
import { IVirtualDocumentProvider } from "Modules/VirtualDocument/Contracts/IVirtualDocumentProvider";
import { IVirtualDocumentStoredDocumentsProvider } from "Modules/VirtualDocument/Contracts/IVirtualDocumentStoredDocumentsProvider";
import { VirtualDocumentProvider } from "Modules/VirtualDocument/Providers/VirtualDocumentProvider";
import { VirtualDocumentStoredDocumentsProvider } from "Modules/VirtualDocument/Providers/VirtualDocumentStoredDocumentsProvider";

@Module({
	imports: [StoredDocumentModule],
	providers: [
		{
			provide: IVirtualDocumentProvider,
			useClass: VirtualDocumentProvider,
		},
		{
			provide: IVirtualDocumentStoredDocumentsProvider,
			useClass: VirtualDocumentStoredDocumentsProvider,
		},
		CreateNewVirtualDocumentAction,
		AssociateStoredDocumentWithVirtualDocumentAction,
		GetVirtualDocumentsWithMostRecentStoredDocumentsAction,
		GetVirtualDocumentsAction,
	],
	exports: [
		CreateNewVirtualDocumentAction,
		AssociateStoredDocumentWithVirtualDocumentAction,
		GetVirtualDocumentsWithMostRecentStoredDocumentsAction,
		GetVirtualDocumentsAction,
	],
})
export class VirtualDocumentModule {}

import { StoredDocumentModule } from "@backend/Modules/StoredDocument/StoredDocument.module";
import { AssociateStoredDocumentWithVirtualDocumentAction } from "@backend/Modules/VirtualDocument/Actions/AssociateStoredDocumentWithVirtualDocumentAction";
import { CreateNewVirtualDocumentAction } from "@backend/Modules/VirtualDocument/Actions/CreateNewVirtualDocumentAction";
import { GetVirtualDocumentsAction } from "@backend/Modules/VirtualDocument/Actions/GetVirtualDocumentsAction";
import { GetVirtualDocumentsWithMostRecentStoredDocumentsAction } from "@backend/Modules/VirtualDocument/Actions/GetVirtualDocumentsWithMostRecentStoredDocumentsAction";
import { IVirtualDocumentProvider } from "@backend/Modules/VirtualDocument/Contracts/IVirtualDocumentProvider";
import { IVirtualDocumentStoredDocumentsProvider } from "@backend/Modules/VirtualDocument/Contracts/IVirtualDocumentStoredDocumentsProvider";
import { VirtualDocumentProvider } from "@backend/Modules/VirtualDocument/Providers/VirtualDocumentProvider";
import { VirtualDocumentStoredDocumentsProvider } from "@backend/Modules/VirtualDocument/Providers/VirtualDocumentStoredDocumentsProvider";
import { Module } from "@nestjs/common";

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

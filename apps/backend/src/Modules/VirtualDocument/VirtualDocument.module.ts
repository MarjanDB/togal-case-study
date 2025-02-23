import { AssociateStoredDocumentWithVirtualDocument } from "@backend/Modules/VirtualDocument/Actions/AssociateStoredDocumentWithVirtualDocument";
import { CreateNewVirtualDocumentAction } from "@backend/Modules/VirtualDocument/Actions/CreateNewVirtualDocument";
import { IVirtualDocumentProvider } from "@backend/Modules/VirtualDocument/Contracts/IVirtualDocumentProvider";
import { IVirtualDocumentStoredDocumentsProvider } from "@backend/Modules/VirtualDocument/Contracts/IVirtualDocumentStoredDocumentsProvider";
import { VirtualDocumentProvider } from "@backend/Modules/VirtualDocument/Providers/VirtualDocumentProvider";
import { VirtualDocumentStoredDocumentsProvider } from "@backend/Modules/VirtualDocument/Providers/VirtualDocumentStoredDocumentsProvider";
import { Module } from "@nestjs/common";

@Module({
	imports: [],
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
		AssociateStoredDocumentWithVirtualDocument,
	],
	exports: [CreateNewVirtualDocumentAction, AssociateStoredDocumentWithVirtualDocument],
})
export class VirtualDocumentModule {}

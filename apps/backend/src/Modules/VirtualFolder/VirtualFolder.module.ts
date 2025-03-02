import { Module } from "@nestjs/common";
import { VirtualDocumentModule } from "Modules/VirtualDocument/VirtualDocument.module";
import { AssociateVirtualDocumentWithVirtualFolderAction } from "Modules/VirtualFolder/Actions/AssociateVirtualDocumentWithVirtualFolderAction";
import { CreateVirtualFolderAction } from "Modules/VirtualFolder/Actions/CreateVirtualFolderAction";
import { GetAllVirtualFoldersWithAssociatedVirtualDocumentsAction } from "Modules/VirtualFolder/Actions/GetAllVirtualFoldersWithAssociatedVirtualDocumentsAction";
import { GetVirtualFoldersWithAssociatedVirtualDocumentsAction } from "Modules/VirtualFolder/Actions/GetVirtualFoldersWithAssociatedVirtualDocumentsAction";
import { IVirtualFolderProvider } from "Modules/VirtualFolder/Contracts/IVirtualFolderProvider";
import { IVirtualFolderVirtualDocumentsProvider } from "Modules/VirtualFolder/Contracts/IVirtualFolderVirtualDocumentsProvider";
import { VirtualFolderProvider } from "Modules/VirtualFolder/Providers/VirtualFolderProvider";
import { VirtualFolderVirtualDocumentsProvider } from "Modules/VirtualFolder/Providers/VirtualFolderVirtualDocumentsProvider";

@Module({
	imports: [VirtualDocumentModule],
	providers: [
		{
			provide: IVirtualFolderProvider.Interface,
			useClass: VirtualFolderProvider,
		},
		{
			provide: IVirtualFolderVirtualDocumentsProvider.Interface,
			useClass: VirtualFolderVirtualDocumentsProvider,
		},
		GetVirtualFoldersWithAssociatedVirtualDocumentsAction.Action,
		CreateVirtualFolderAction.Action,
		AssociateVirtualDocumentWithVirtualFolderAction.Action,
		GetAllVirtualFoldersWithAssociatedVirtualDocumentsAction.Action,
	],
	exports: [
		GetVirtualFoldersWithAssociatedVirtualDocumentsAction.Action,
		CreateVirtualFolderAction.Action,
		AssociateVirtualDocumentWithVirtualFolderAction.Action,
		GetAllVirtualFoldersWithAssociatedVirtualDocumentsAction.Action,
	],
})
export class VirtualFolderModule {}

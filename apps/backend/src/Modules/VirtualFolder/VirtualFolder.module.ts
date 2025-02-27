import { Module } from "@nestjs/common";
import { CreateVirtualFolderAction } from "Modules/VirtualFolder/Actions/CreateVirtualFolderAction";
import { GetVirtualFoldersWithAssociatedVirtualDocumentsAction } from "Modules/VirtualFolder/Actions/GetVirtualFoldersWithAssociatedVirtualDocumentsAction";
import { IVirtualFolderProvider } from "Modules/VirtualFolder/Contracts/IVirtualFolderProvider";
import { IVirtualFolderVirtualDocumentsProvider } from "Modules/VirtualFolder/Contracts/IVirtualFolderVirtualDocumentsProvider";
import { VirtualFolderProvider } from "Modules/VirtualFolder/Providers/VirtualFolderProvider";
import { VirtualFolderVirtualDocumentsProvider } from "Modules/VirtualFolder/Providers/VirtualFolderVirtualDocumentsProvider";

@Module({
	imports: [],
	providers: [
		{
			provide: IVirtualFolderProvider,
			useClass: VirtualFolderProvider,
		},
		{
			provide: IVirtualFolderVirtualDocumentsProvider,
			useClass: VirtualFolderVirtualDocumentsProvider,
		},
		GetVirtualFoldersWithAssociatedVirtualDocumentsAction,
		CreateVirtualFolderAction,
	],
	exports: [GetVirtualFoldersWithAssociatedVirtualDocumentsAction, CreateVirtualFolderAction],
})
export class VirtualFolderModule {}

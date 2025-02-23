import { IVirtualFolderProvider } from "@backend/Modules/VirtualFolder/Contracts/IVirtualFolderProvider";
import { IVirtualFolderVirtualDocumentsProvider } from "@backend/Modules/VirtualFolder/Contracts/IVirtualFolderVirtualDocumentsProvider";
import { VirtualFolderProvider } from "@backend/Modules/VirtualFolder/Providers/VirtualFolderProvider";
import { VirtualFolderVirtualDocumentsProvider } from "@backend/Modules/VirtualFolder/Providers/VirtualFolderVirtualDocumentsProvider";
import { Module } from "@nestjs/common";

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
	],
	exports: [],
})
export class VirtualFolderModule {}

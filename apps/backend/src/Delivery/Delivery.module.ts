import { Module } from "@nestjs/common";
import { StoredDocumentsController } from "Delivery/Controllers/StoredDocuments/StoredDocuments.controller";
import { VirtualDocumentsController } from "Delivery/Controllers/VirtualDocuments/VirtualDocuments.controller";
import { VirtualFoldersController } from "Delivery/Controllers/VirtualFolders/VirtualFolders.controller";
import { MemoryStoredFile, NestjsFormDataModule } from "nestjs-form-data";

@Module({
	imports: [
		NestjsFormDataModule.config({
			// In general, you would use FileSystemStoredFile,
			// as keeping it in memory is a waste of RAM
			storage: MemoryStoredFile,
			limits: { fileSize: 1024 * 1000, files: 1 },
			cleanupAfterSuccessHandle: true,
			cleanupAfterFailedHandle: true,
		}),
	],
	controllers: [StoredDocumentsController, VirtualDocumentsController, VirtualFoldersController],
	providers: [],
	exports: [],
})
export class DeliveryModule {}

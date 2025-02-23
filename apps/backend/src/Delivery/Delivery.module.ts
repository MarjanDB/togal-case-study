import { StoredDocumentsController } from "@backend/Delivery/StoredDocuments.controller";
import { VirtualDocumentsController } from "@backend/Delivery/VirtualDocuments.controller";
import { VirtualFoldersController } from "@backend/Delivery/VirtualFolders.controller";
import { Module } from "@nestjs/common";

@Module({
	imports: [],
	controllers: [StoredDocumentsController, VirtualDocumentsController, VirtualFoldersController],
	providers: [],
	exports: [],
})
export class DeliveryModule {}

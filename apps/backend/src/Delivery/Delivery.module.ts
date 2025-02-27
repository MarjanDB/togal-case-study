import { Module } from "@nestjs/common";
import { StoredDocumentsController } from "Delivery/StoredDocuments.controller";
import { VirtualDocumentsController } from "Delivery/VirtualDocuments.controller";
import { VirtualFoldersController } from "Delivery/VirtualFolders.controller";

@Module({
	imports: [],
	controllers: [StoredDocumentsController, VirtualDocumentsController, VirtualFoldersController],
	providers: [],
	exports: [],
})
export class DeliveryModule {}

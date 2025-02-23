import { GetStoredDocumentsForVirtualDocumentController } from "@backend/Delivery/StoredDocument/GetStoredDocumentsForVirtualDocuments.controller";
import { Module } from "@nestjs/common";

@Module({
	imports: [],
	controllers: [GetStoredDocumentsForVirtualDocumentController],
	providers: [],
	exports: [],
})
export class DeliveryModule {}

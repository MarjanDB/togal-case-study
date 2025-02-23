import { StoredDocumentModule } from "@backend/Modules/StoredDocument/StoredDocument.module";
import { VirtualDocumentModule } from "@backend/Modules/VirtualDocument/VirtualDocument.module";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
	imports: [StoredDocumentModule, VirtualDocumentModule],
	exports: [StoredDocumentModule, VirtualDocumentModule],
})
export class ModulesModule {}

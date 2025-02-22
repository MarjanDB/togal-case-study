import { StoredDocumentModule } from "@backend/Modules/StoredDocument/StoredDocument.module";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
	imports: [StoredDocumentModule],
	exports: [StoredDocumentModule],
})
export class ModulesModule {}

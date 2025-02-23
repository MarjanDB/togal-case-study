import { StoredDocumentModule } from "@backend/Modules/StoredDocument/StoredDocument.module";
import { VirtualDocumentModule } from "@backend/Modules/VirtualDocument/VirtualDocument.module";
import { VirtualFolderModule } from "@backend/Modules/VirtualFolder/VirtualFolder.module";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
	imports: [StoredDocumentModule, VirtualDocumentModule, VirtualFolderModule],
	exports: [StoredDocumentModule, VirtualDocumentModule, VirtualFolderModule],
})
export class ModulesModule {}

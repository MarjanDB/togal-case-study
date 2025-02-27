import { Global, Module } from "@nestjs/common";
import { StoredDocumentModule } from "Modules/StoredDocument/StoredDocument.module";
import { VirtualDocumentModule } from "Modules/VirtualDocument/VirtualDocument.module";
import { VirtualFolderModule } from "Modules/VirtualFolder/VirtualFolder.module";

@Global()
@Module({
	imports: [StoredDocumentModule, VirtualDocumentModule, VirtualFolderModule],
	exports: [StoredDocumentModule, VirtualDocumentModule, VirtualFolderModule],
})
export class ModulesModule {}

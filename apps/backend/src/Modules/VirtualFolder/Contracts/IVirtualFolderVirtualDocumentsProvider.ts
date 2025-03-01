import { Injectable } from "@nestjs/common";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualFolder } from "Modules/VirtualFolder/Entities/VirtualFolder";

export namespace IVirtualFolderVirtualDocumentsProvider {
	@Injectable()
	export abstract class Interface {
		abstract addVirtualDocumentToVirtualFolder(
			virtualFolderId: VirtualFolder.Types.IdType,
			virtualDocumentId: VirtualDocument.Types.IdType,
		): Promise<void>;
	}
}

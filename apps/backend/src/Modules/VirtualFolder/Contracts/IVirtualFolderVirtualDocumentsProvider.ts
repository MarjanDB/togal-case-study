import { Injectable } from "@nestjs/common";
import { VirtualDocumentId } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualFolderId } from "Modules/VirtualFolder/Entities/VirtualFolder";

@Injectable()
export abstract class IVirtualFolderVirtualDocumentsProvider {
	abstract addVirtualDocumentToVirtualFolder(virtualFolderId: VirtualFolderId, virtualDocumentId: VirtualDocumentId): Promise<void>;
}

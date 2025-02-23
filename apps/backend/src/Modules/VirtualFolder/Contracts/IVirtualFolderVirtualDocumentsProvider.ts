import { VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualFolderId } from "@backend/Modules/VirtualFolder/Entities/VirtualFolder";
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class IVirtualFolderVirtualDocumentsProvider {
	abstract addVirtualDocumentToVirtualFolder(virtualFolderId: VirtualFolderId, virtualDocumentId: VirtualDocumentId): Promise<void>;
}

import { GetVirtualDocumentsWithMostRecentStoredDocumentsActionTypes } from "@backend/Modules/VirtualDocument/Actions/GetVirtualDocumentsWithMostRecentStoredDocumentsAction";
import { VirtualDocument, VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualFolderId } from "@backend/Modules/VirtualFolder/Entities/VirtualFolder";
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class IVirtualDocumentProvider {
	abstract create(document: VirtualDocument): Promise<void>;
	abstract findById(id: VirtualDocumentId): Promise<VirtualDocument>;
	abstract findByIds(ids: VirtualDocumentId[]): Promise<VirtualDocument[]>;
	abstract findForVirtualFolder(
		folderIds: VirtualFolderId[],
	): Promise<GetVirtualDocumentsWithMostRecentStoredDocumentsActionTypes.QueryResult[]>;
}

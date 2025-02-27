import { Injectable } from "@nestjs/common";
import { GetVirtualDocumentsWithMostRecentStoredDocumentsActionTypes } from "Modules/VirtualDocument/Actions/GetVirtualDocumentsWithMostRecentStoredDocumentsAction";
import { VirtualDocument, VirtualDocumentId } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualFolderId } from "Modules/VirtualFolder/Entities/VirtualFolder";

@Injectable()
export abstract class IVirtualDocumentProvider {
	abstract create(document: VirtualDocument): Promise<void>;
	abstract findById(id: VirtualDocumentId): Promise<VirtualDocument>;
	abstract findByIds(ids: VirtualDocumentId[]): Promise<VirtualDocument[]>;
	abstract findForVirtualFolder(
		folderIds: VirtualFolderId[],
	): Promise<GetVirtualDocumentsWithMostRecentStoredDocumentsActionTypes.QueryResult[]>;
}

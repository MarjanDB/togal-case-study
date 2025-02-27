import { VirtualDocumentId } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualFolderId } from "Modules/VirtualFolder/Entities/VirtualFolder";
import typia from "typia";

export class VirtualFolderVirtualDocument {
	public constructor(
		public readonly virtualFolderId: VirtualFolderId,
		public readonly virtualDocumentId: VirtualDocumentId,
	) {}

	public static fromDto(dto: VirtualFolderVirtualDocumentDto): VirtualFolderVirtualDocument {
		return new VirtualFolderVirtualDocument(dto.virtual_folder_id, dto.virtual_document_id);
	}

	public static toDto(document: VirtualFolderVirtualDocument): VirtualFolderVirtualDocumentDto {
		return { virtual_folder_id: document.virtualFolderId, virtual_document_id: document.virtualDocumentId };
	}
}

export interface VirtualFolderVirtualDocumentDto {
	virtual_folder_id: VirtualFolderId;
	virtual_document_id: VirtualDocumentId;
}

export const VirtualFolderVirtualDocumentDto = {
	asserter: typia.createAssert<VirtualFolderVirtualDocumentDto>(),
	asserterArray: typia.createAssert<VirtualFolderVirtualDocumentDto[]>(),
};

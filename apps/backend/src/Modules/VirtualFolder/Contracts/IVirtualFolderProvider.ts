import { VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualFolder, VirtualFolderDto, VirtualFolderId } from "@backend/Modules/VirtualFolder/Entities/VirtualFolder";
import { Injectable } from "@nestjs/common";
import typia from "typia";

@Injectable()
export abstract class IVirtualFolderProvider {
	abstract create(folder: VirtualFolder): Promise<void>;
	abstract findById(id: VirtualFolderId): Promise<VirtualFolder>;
	abstract findByIds(ids: VirtualFolderId[]): Promise<VirtualFolder[]>;
	abstract findAll(): Promise<VirtualFolder[]>;
	abstract findAllWithAssociatedVirtualDocuments(): Promise<IVirtualFolderProviderTypes.VirtualFolderWithAssociatedVirtualDocumentsQuery[]>;
}

export namespace IVirtualFolderProviderTypes {
	export type VirtualFolderWithAssociatedVirtualDocumentsQuery = VirtualFolderDto & {
		virtual_document_id: VirtualDocumentId;
	};

	export const VirtualFolderWithAssociatedVirtualDocumentsQuery = {
		asserter: typia.createAssert<VirtualFolderWithAssociatedVirtualDocumentsQuery>(),
		asserterArray: typia.createAssert<VirtualFolderWithAssociatedVirtualDocumentsQuery[]>(),
	};
}

import { VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { IVirtualFolderProvider } from "@backend/Modules/VirtualFolder/Contracts/IVirtualFolderProvider";
import { VirtualFolder, VirtualFolderId } from "@backend/Modules/VirtualFolder/Entities/VirtualFolder";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetVirtualFoldersActionWithAssociatedVirtualDocumentsAction {
	public constructor(@Inject(IVirtualFolderProvider) private readonly virtualFolderProvider: IVirtualFolderProvider) {}

	public async execute(): Promise<
		GetVirtualFoldersActionWithAssociatedVirtualDocumentsActionTypes.VirtualFolderWithAssociatedVirtualDocuments[]
	> {
		const virtualFolders = await this.virtualFolderProvider.findAllWithAssociatedVirtualDocuments();

		const virtualFolderDefinitions: Record<VirtualFolderId, VirtualFolder> = {};
		const associatedVirtualDocuments: Record<VirtualFolderId, VirtualDocumentId[]> = {};

		for (const virtualFolder of virtualFolders) {
			virtualFolderDefinitions[virtualFolder.id] = VirtualFolder.fromDto(virtualFolder);
			if (virtualFolder.virtual_document_id) {
				associatedVirtualDocuments[virtualFolder.id] = [
					...(associatedVirtualDocuments[virtualFolder.id] ?? []),
					virtualFolder.virtual_document_id,
				];
			}
		}

		const virtualFoldersWithAssociatedVirtualDocuments: GetVirtualFoldersActionWithAssociatedVirtualDocumentsActionTypes.VirtualFolderWithAssociatedVirtualDocuments[] =
			Object.keys(virtualFolderDefinitions).map((virtualFolderId) => ({
				virtualFolder: virtualFolderDefinitions[virtualFolderId as VirtualFolderId],
				virtualDocumentIds: associatedVirtualDocuments[virtualFolderId as VirtualFolderId] ?? [],
			}));

		return virtualFoldersWithAssociatedVirtualDocuments;
	}
}

export namespace GetVirtualFoldersActionWithAssociatedVirtualDocumentsActionTypes {
	export type VirtualFolderWithAssociatedVirtualDocuments = {
		virtualFolder: VirtualFolder;
		virtualDocumentIds: VirtualDocumentId[];
	};
}

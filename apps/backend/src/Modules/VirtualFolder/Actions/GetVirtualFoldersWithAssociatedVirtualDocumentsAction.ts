import { VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { IVirtualFolderProvider } from "@backend/Modules/VirtualFolder/Contracts/IVirtualFolderProvider";
import { VirtualFolder, VirtualFolderId } from "@backend/Modules/VirtualFolder/Entities/VirtualFolder";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetVirtualFoldersWithAssociatedVirtualDocumentsAction {
	public constructor(@Inject(IVirtualFolderProvider) private readonly virtualFolderProvider: IVirtualFolderProvider) {}

	public async execute(): Promise<GetVirtualFoldersWithAssociatedVirtualDocumentsActionTypes.VirtualFolderWithAssociatedVirtualDocuments[]> {
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

		const virtualFoldersWithAssociatedVirtualDocuments: GetVirtualFoldersWithAssociatedVirtualDocumentsActionTypes.VirtualFolderWithAssociatedVirtualDocuments[] =
			Object.keys(virtualFolderDefinitions).map((virtualFolderId) => ({
				virtualFolder: virtualFolderDefinitions[virtualFolderId as VirtualFolderId],
				virtualDocumentIds: associatedVirtualDocuments[virtualFolderId as VirtualFolderId] ?? [],
			}));

		return virtualFoldersWithAssociatedVirtualDocuments;
	}
}

export namespace GetVirtualFoldersWithAssociatedVirtualDocumentsActionTypes {
	export type VirtualFolderWithAssociatedVirtualDocuments = {
		virtualFolder: VirtualFolder;
		virtualDocumentIds: VirtualDocumentId[];
	};
}

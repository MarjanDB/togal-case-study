import { Inject, Injectable } from "@nestjs/common";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { IVirtualFolderProvider } from "Modules/VirtualFolder/Contracts/IVirtualFolderProvider";
import { VirtualFolder } from "Modules/VirtualFolder/Entities/VirtualFolder";

export namespace GetVirtualFoldersWithAssociatedVirtualDocumentsAction {
	@Injectable()
	export class Action {
		public constructor(@Inject(IVirtualFolderProvider.Interface) private readonly virtualFolderProvider: IVirtualFolderProvider.Interface) {}

		public async execute(): Promise<Types.VirtualFolderWithAssociatedVirtualDocuments[]> {
			const virtualFolders = await this.virtualFolderProvider.findAllWithAssociatedVirtualDocuments();

			const virtualFolderDefinitions: Record<VirtualFolder.Types.IdType, VirtualFolder.Entity> = {};
			const associatedVirtualDocuments: Record<VirtualFolder.Types.IdType, VirtualDocument.Types.IdType[]> = {};

			for (const virtualFolder of virtualFolders) {
				virtualFolderDefinitions[virtualFolder.id as VirtualFolder.Types.IdType] = VirtualFolder.Entity.fromDto(virtualFolder);
				if (virtualFolder.virtual_document_id) {
					associatedVirtualDocuments[virtualFolder.id as VirtualFolder.Types.IdType] = [
						...(associatedVirtualDocuments[virtualFolder.id as VirtualFolder.Types.IdType] ?? []),
						virtualFolder.virtual_document_id as VirtualDocument.Types.IdType,
					];
				}
			}

			const virtualFoldersWithAssociatedVirtualDocuments: Types.VirtualFolderWithAssociatedVirtualDocuments[] = Object.keys(
				virtualFolderDefinitions,
			).map((virtualFolderId) => ({
				virtualFolder: virtualFolderDefinitions[virtualFolderId as VirtualFolder.Types.IdType],
				virtualDocumentIds: associatedVirtualDocuments[virtualFolderId as VirtualFolder.Types.IdType] ?? [],
			}));

			return virtualFoldersWithAssociatedVirtualDocuments;
		}
	}

	export namespace Types {
		export type VirtualFolderWithAssociatedVirtualDocuments = {
			virtualFolder: VirtualFolder.Entity;
			virtualDocumentIds: VirtualDocument.Types.IdType[];
		};
	}
}

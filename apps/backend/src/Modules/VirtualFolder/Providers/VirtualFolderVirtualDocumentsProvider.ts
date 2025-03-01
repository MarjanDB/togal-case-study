import { Inject } from "@nestjs/common";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { IVirtualFolderVirtualDocumentsProvider } from "Modules/VirtualFolder/Contracts/IVirtualFolderVirtualDocumentsProvider";
import { VirtualFolder } from "Modules/VirtualFolder/Entities/VirtualFolder";
import { VirtualFolderVirtualDocument } from "Modules/VirtualFolder/Entities/VirtualFolderVirtualDocument";
import { IPostgresDatabaseProvider } from "Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";

export class VirtualFolderVirtualDocumentsProvider implements IVirtualFolderVirtualDocumentsProvider.Interface {
	public constructor(@Inject(IPostgresDatabaseProvider) private readonly database: IPostgresDatabaseProvider) {}

	public async addVirtualDocumentToVirtualFolder(
		virtualFolderId: VirtualFolder.Types.IdType,
		virtualDocumentId: VirtualDocument.Types.IdType,
	): Promise<void> {
		const toInsert: VirtualFolderVirtualDocument.Types.Dto = {
			virtual_folder_id: virtualFolderId,
			virtual_document_id: virtualDocumentId,
		};

		await this.database.insert([toInsert], ["virtual_folder_id", "virtual_document_id"], "virtual_folders_virtual_documents");
	}
}

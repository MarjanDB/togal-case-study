import { VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { IVirtualFolderVirtualDocumentsProvider } from "@backend/Modules/VirtualFolder/Contracts/IVirtualFolderVirtualDocumentsProvider";
import { VirtualFolderId } from "@backend/Modules/VirtualFolder/Entities/VirtualFolder";
import { VirtualFolderVirtualDocumentDto } from "@backend/Modules/VirtualFolder/Entities/VirtualFolderVirtualDocument";
import { IPostgresDatabaseProvider } from "@backend/Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";
import { Inject } from "@nestjs/common";

export class VirtualFolderVirtualDocumentsProvider implements IVirtualFolderVirtualDocumentsProvider {
	public constructor(@Inject(IPostgresDatabaseProvider) private readonly database: IPostgresDatabaseProvider) {}

	public async addVirtualDocumentToVirtualFolder(virtualFolderId: VirtualFolderId, virtualDocumentId: VirtualDocumentId): Promise<void> {
		const toInsert: VirtualFolderVirtualDocumentDto = { virtual_folder_id: virtualFolderId, virtual_document_id: virtualDocumentId };

		await this.database.insert([toInsert], ["virtual_folder_id", "virtual_document_id"], "virtual_folders_virtual_documents");
	}
}

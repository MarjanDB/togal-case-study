import { StoredDocumentId } from "@backend/Modules/StoredDocument/Entities/StoredDocument";
import { IVirtualDocumentStoredDocumentsProvider } from "@backend/Modules/VirtualDocument/Contracts/IVirtualDocumentStoredDocumentsProvider";
import { VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class AssociateStoredDocumentWithVirtualDocumentAction {
	public constructor(
		@Inject(IVirtualDocumentStoredDocumentsProvider)
		private readonly virtualDocumentStoredDocumentsProvider: IVirtualDocumentStoredDocumentsProvider,
	) {}

	public async execute(virtualDocumentId: VirtualDocumentId, storedDocumentId: StoredDocumentId): Promise<void> {
		await this.virtualDocumentStoredDocumentsProvider.addStoredDocumentToVirtualDocument(virtualDocumentId, storedDocumentId);
	}
}

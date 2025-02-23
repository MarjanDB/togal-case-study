import { StoredDocumentId } from "@backend/Modules/StoredDocument/Entities/StoredDocument";
import { VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class IVirtualDocumentStoredDocumentsProvider {
	abstract addStoredDocumentToVirtualDocument(virtualDocumentId: VirtualDocumentId, storedDocumentId: StoredDocumentId): Promise<void>;
}

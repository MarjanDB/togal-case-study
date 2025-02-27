import { Injectable } from "@nestjs/common";
import { StoredDocumentId } from "Modules/StoredDocument/Entities/StoredDocument";
import { VirtualDocumentId } from "Modules/VirtualDocument/Entities/VirtualDocument";

@Injectable()
export abstract class IVirtualDocumentStoredDocumentsProvider {
	abstract addStoredDocumentToVirtualDocument(virtualDocumentId: VirtualDocumentId, storedDocumentId: StoredDocumentId): Promise<void>;
}

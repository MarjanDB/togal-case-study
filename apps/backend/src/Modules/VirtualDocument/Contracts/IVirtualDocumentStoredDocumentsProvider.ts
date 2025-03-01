import { Injectable } from "@nestjs/common";
import { StoredDocument } from "Modules/StoredDocument/Entities/StoredDocument";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";

export namespace IVirtualDocumentStoredDocumentsProvider {
	@Injectable()
	export abstract class Interface {
		abstract addStoredDocumentToVirtualDocument(
			virtualDocumentId: VirtualDocument.Types.IdType,
			storedDocumentId: StoredDocument.Types.IdType,
		): Promise<void>;
	}
}

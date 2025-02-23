import { StoredDocumentId } from "@backend/Modules/StoredDocument/Entities/StoredDocument";
import { VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import typia from "typia";

export class VirtualDocumentStoredDocument {
	public constructor(
		public readonly virtualDocumentId: VirtualDocumentId,
		public readonly storedDocumentId: StoredDocumentId,
	) {}

	public static fromDto(dto: VirtualDocumentStoredDocumentDto): VirtualDocumentStoredDocument {
		return new VirtualDocumentStoredDocument(dto.virtual_document_id, dto.stored_document_id);
	}

	public static toDto(document: VirtualDocumentStoredDocument): VirtualDocumentStoredDocumentDto {
		return { virtual_document_id: document.virtualDocumentId, stored_document_id: document.storedDocumentId };
	}
}

export interface VirtualDocumentStoredDocumentDto {
	virtual_document_id: VirtualDocumentId;
	stored_document_id: StoredDocumentId;
}

export const VirtualDocumentStoredDocumentDto = {
	asserter: typia.createAssert<VirtualDocumentStoredDocumentDto>(),
	asserterArray: typia.createAssert<VirtualDocumentStoredDocumentDto[]>(),
};

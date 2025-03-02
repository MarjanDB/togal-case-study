import { Controller, Get, Inject, Query } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { GetStoredDocumentsForVirtualDocument } from "Delivery/Controllers/StoredDocuments/GetStoredDocumentsForVirtualDocument";
import { FindStoredDocumentsBelongingToVirtualDocumentsAction } from "Modules/StoredDocument/Actions/FindStoredDocumentsBelongingToVirtualDocumentsAction";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";

@Controller("stored-documents")
export class StoredDocumentsController {
	public constructor(
		@Inject(FindStoredDocumentsBelongingToVirtualDocumentsAction.Action)
		private readonly findStoredDocumentsBelongingToVirtualDocumentsAction: FindStoredDocumentsBelongingToVirtualDocumentsAction.Action,
	) {}

	@Get("get-stored-documents-for-virtual-document")
	@ApiResponse({ status: 200, type: GetStoredDocumentsForVirtualDocument.Response })
	async getStoredDocumentsForVirtualDocuments(
		@Query() query: GetStoredDocumentsForVirtualDocument.GetParameters,
	): Promise<GetStoredDocumentsForVirtualDocument.Response> {
		const storedDocuments = await this.findStoredDocumentsBelongingToVirtualDocumentsAction.execute([
			query.virtualDocumentId as VirtualDocument.Types.IdType,
		]);

		const documents: GetStoredDocumentsForVirtualDocument.StoredDocumentForVirtualDocument[] = [];

		for (const [virtualDocumentId, virtualDocumentLookup] of Object.entries(storedDocuments)) {
			for (const [storedDocumentId, storedDocument] of Object.entries(virtualDocumentLookup)) {
				documents.push({
					id: storedDocumentId,
					storedAt: storedDocument.storedAt,
					originalFileName: storedDocument.originalFileName,
					virtualDocumentId: virtualDocumentId,
				});
			}
		}

		return {
			storedDocuments: documents,
		};
	}
}

import { Controller, Get, Inject, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { GetStoredDocumentsForVirtualDocument } from "Delivery/Contracts/Endpoints/GetStoredDocumentsForVirtualDocument";
import { FindStoredDocumentsBelongingToVirtualDocumentsAction } from "Modules/StoredDocument/Actions/FindStoredDocumentsBelongingToVirtualDocumentsAction";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";

@Controller("stored-documents")
export class StoredDocumentsController {
	public constructor(
		@Inject(FindStoredDocumentsBelongingToVirtualDocumentsAction.Action)
		private readonly findStoredDocumentsBelongingToVirtualDocumentsAction: FindStoredDocumentsBelongingToVirtualDocumentsAction.Action,
	) {}

	@Get("get-stored-documents-for-virtual-documents")
	@ApiOperation({ summary: "Get stored documents for virtual documents" })
	@ApiQuery({ type: GetStoredDocumentsForVirtualDocument.GetParameters })
	@ApiResponse({ type: GetStoredDocumentsForVirtualDocument.Response })
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

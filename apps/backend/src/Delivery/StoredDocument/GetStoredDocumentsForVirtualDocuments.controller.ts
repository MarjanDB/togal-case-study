import { FindStoredDocumentsBelongingToVirtualDocumentsAction } from "@backend/Modules/StoredDocument/Actions/FindStoredDocumentsBelongingToVirtualDocumentsAction";
import { VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { GetStoredDocumentsForVirtualDocument } from "@contracts/Endpoints/GetStoredDocumentsForVirtualDocument";
import { Controller, Get, Inject, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery } from "@nestjs/swagger";

@Controller("stored-documents")
export class GetStoredDocumentsForVirtualDocumentController {
	public constructor(
		@Inject(FindStoredDocumentsBelongingToVirtualDocumentsAction)
		private readonly findStoredDocumentsBelongingToVirtualDocumentsAction: FindStoredDocumentsBelongingToVirtualDocumentsAction,
	) {}

	@Get("virtual-document")
	@ApiOperation({ summary: "Get stored documents for virtual documents" })
	@ApiQuery({ type: GetStoredDocumentsForVirtualDocument.GetParameters })
	async getStoredDocumentsForVirtualDocuments(
		@Query() query: GetStoredDocumentsForVirtualDocument.GetParameters,
	): Promise<GetStoredDocumentsForVirtualDocument.Response> {
		const storedDocuments = await this.findStoredDocumentsBelongingToVirtualDocumentsAction.execute([
			query.virtualDocumentId as VirtualDocumentId,
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

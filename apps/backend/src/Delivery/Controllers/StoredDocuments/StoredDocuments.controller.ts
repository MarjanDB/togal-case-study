import { Controller, Get, Inject, Query, StreamableFile } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { DownloadStoredDocument } from "Delivery/Controllers/StoredDocuments/DownloadStoredDocument";
import { GetStoredDocumentsForVirtualDocument } from "Delivery/Controllers/StoredDocuments/GetStoredDocumentsForVirtualDocument";
import { FindStoredDocumentsBelongingToVirtualDocumentsAction } from "Modules/StoredDocument/Actions/FindStoredDocumentsBelongingToVirtualDocumentsAction";
import { GetStoredDocumentAction } from "Modules/StoredDocument/Actions/GetStoredDocumentAction";
import { StoredDocument } from "Modules/StoredDocument/Entities/StoredDocument";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { Readable } from "stream";

@Controller("stored-documents")
export class StoredDocumentsController {
	public constructor(
		@Inject(FindStoredDocumentsBelongingToVirtualDocumentsAction.Action)
		private readonly findStoredDocumentsBelongingToVirtualDocumentsAction: FindStoredDocumentsBelongingToVirtualDocumentsAction.Action,
		@Inject(GetStoredDocumentAction.Action)
		private readonly getStoredDocumentAction: GetStoredDocumentAction.Action,
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

	@Get("download-stored-document")
	async downloadStoredDocument(@Query() query: DownloadStoredDocument.Parameters): Promise<StreamableFile> {
		const storedDocument = await this.getStoredDocumentAction.execute(query.storedDocumentId as StoredDocument.Types.IdType);

		return new StreamableFile(Readable.from(storedDocument.data), {
			disposition: `attachment; filename="${storedDocument.originalFileName}"`,
		});
	}
}

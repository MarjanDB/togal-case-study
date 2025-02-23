import { FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction } from "@backend/Modules/StoredDocument/Actions/FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction";
import { StoredDocument } from "@backend/Modules/StoredDocument/Entities/StoredDocument";
import { GetVirtualDocumentsAction } from "@backend/Modules/VirtualDocument/Actions/GetVirtualDocumentsAction";
import { VirtualDocument, VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { GetVirtualDocuments } from "@contracts/Endpoints/GetVirtualDocuments";
import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ApiBody, ApiResponse } from "@nestjs/swagger";

@Controller("virtual-documents")
export class VirtualDocumentsController {
	public constructor(
		@Inject(FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction)
		private readonly findMostRecentStoredDocumentBelongingToVirtualDocumentsAction: FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction,
		@Inject(GetVirtualDocumentsAction)
		private readonly getVirtualDocumentsAction: GetVirtualDocumentsAction,
	) {}

	@Post("get-documents")
	@ApiBody({ type: GetVirtualDocuments.Parameters })
	@ApiResponse({ type: GetVirtualDocuments.Response })
	async getStoredDocumentsForVirtualDocuments(@Body() body: GetVirtualDocuments.Parameters): Promise<GetVirtualDocuments.Response> {
		const virtualDocumentIds: VirtualDocumentId[] = body.virtualDocumentIds as VirtualDocumentId[];

		const storedDocuments = await this.findMostRecentStoredDocumentBelongingToVirtualDocumentsAction.execute(virtualDocumentIds);

		const virtualDocuments = await this.getVirtualDocumentsAction.execute(virtualDocumentIds);

		const virtualDocumentAndStoredDocumentLookup: Record<
			VirtualDocumentId,
			{ virtualDocument: VirtualDocument; storedDocument: StoredDocument }
		> = {};

		for (const virtualDocument of virtualDocuments) {
			virtualDocumentAndStoredDocumentLookup[virtualDocument.id] = {
				virtualDocument: virtualDocument,
				storedDocument: storedDocuments[virtualDocument.id],
				// This is potentially unsafe, since in some odd edge case it could be possible that
				// There is no matching stored document for the virtual document.
			};
		}

		const documents: GetVirtualDocuments.Response = {
			virtualDocuments: [],
		};

		documents.virtualDocuments = Object.values(virtualDocumentAndStoredDocumentLookup).map((virtualDocument) => ({
			id: virtualDocument.virtualDocument.id,
			name: virtualDocument.virtualDocument.name,
			description: virtualDocument.virtualDocument.description,
			createdAt: virtualDocument.virtualDocument.createdAt,
			updatedAt: virtualDocument.virtualDocument.updatedAt,
			mostRecentStoredDocument: {
				id: virtualDocument.storedDocument.id,
				storedAt: virtualDocument.storedDocument.storedAt,
				originalFileName: virtualDocument.storedDocument.originalFileName,
			},
		}));

		return documents;
	}
}

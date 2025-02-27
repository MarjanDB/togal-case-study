import { Body, Controller, Inject, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiResponse } from "@nestjs/swagger";
import { CreateVirtualDocument } from "Endpoints/CreateVirtualDocument";
import { GetVirtualDocuments } from "Endpoints/GetVirtualDocuments";
import { DateTime } from "luxon";
import { FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction } from "Modules/StoredDocument/Actions/FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction";
import { StoredDocument } from "Modules/StoredDocument/Entities/StoredDocument";
import { GetVirtualDocumentsAction } from "Modules/VirtualDocument/Actions/GetVirtualDocumentsAction";
import { VirtualDocument, VirtualDocumentId } from "Modules/VirtualDocument/Entities/VirtualDocument";

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

	@Post("upload-document")
	@UseInterceptors(FileInterceptor("file"))
	@ApiBody({ type: CreateVirtualDocument.Parameters })
	@ApiConsumes("multipart/form-data")
	@ApiResponse({ type: CreateVirtualDocument.Response })
	async uploadDocument(
		@Body() body: CreateVirtualDocument.Parameters,
		@UploadedFile() file: Express.Multer.File,
	): Promise<CreateVirtualDocument.Response> {
		console.log(file);

		return {
			id: "123",
			name: "Test",
			description: "Test",
			createdAt: DateTime.now(),
			updatedAt: DateTime.now(),
		};
	}
}

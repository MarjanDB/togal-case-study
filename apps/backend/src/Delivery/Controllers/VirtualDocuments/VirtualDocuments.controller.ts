import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ApiConsumes, ApiResponse } from "@nestjs/swagger";
import { CreateVirtualDocument } from "Delivery/Controllers/VirtualDocuments/CreateVirtualDocument";
import { GetVirtualDocuments } from "Delivery/Controllers/VirtualDocuments/GetVirtualDocuments";
import { UploadAdditionalFileToVirtualDocument } from "Delivery/Controllers/VirtualDocuments/UploadAdditionalFileToVirtualDocument";
import { FindMostRecentStoredDocumentBelongingToVirtualDocuments } from "Modules/StoredDocument/Actions/FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction";
import { StoredDocumentEntry } from "Modules/StoredDocument/Entities/StoredDocumentEntry";
import { GetVirtualDocumentsAction } from "Modules/VirtualDocument/Actions/GetVirtualDocumentsAction";
import { UploadingOfFileToExistingDocumentAction } from "Modules/VirtualDocument/Actions/UploadingOfFileToExistingDocumentAction";
import { UploadingOfNewDocumentAction } from "Modules/VirtualDocument/Actions/UploadingOfNewDocumentAction";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { FormDataRequest } from "nestjs-form-data";

@Controller("virtual-documents")
export class VirtualDocumentsController {
	public constructor(
		@Inject(FindMostRecentStoredDocumentBelongingToVirtualDocuments.Action)
		private readonly findMostRecentStoredDocumentBelongingToVirtualDocumentsAction: FindMostRecentStoredDocumentBelongingToVirtualDocuments.Action,
		@Inject(GetVirtualDocumentsAction.Action)
		private readonly getVirtualDocumentsAction: GetVirtualDocumentsAction.Action,
		@Inject(UploadingOfNewDocumentAction.Action)
		private readonly uploadingOfNewDocumentAction: UploadingOfNewDocumentAction.Action,
		@Inject(UploadingOfFileToExistingDocumentAction.Action)
		private readonly uploadingOfFileToExistingDocumentAction: UploadingOfFileToExistingDocumentAction.Action,
	) {}

	@Post("get-documents")
	@ApiResponse({ status: 200, type: GetVirtualDocuments.Response })
	async getStoredDocumentsForVirtualDocuments(@Body() body: GetVirtualDocuments.Parameters): Promise<GetVirtualDocuments.Response> {
		const virtualDocumentIds: VirtualDocument.Types.IdType[] = body.virtualDocumentIds as VirtualDocument.Types.IdType[];

		const storedDocuments = await this.findMostRecentStoredDocumentBelongingToVirtualDocumentsAction.execute(virtualDocumentIds);

		const virtualDocuments = await this.getVirtualDocumentsAction.execute(virtualDocumentIds);

		const virtualDocumentAndStoredDocumentLookup: Record<
			VirtualDocument.Types.IdType,
			{ virtualDocument: VirtualDocument.Entity; storedDocument: StoredDocumentEntry.Entity }
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
	@FormDataRequest()
	@ApiConsumes("multipart/form-data")
	@ApiResponse({ status: 200, type: CreateVirtualDocument.Response })
	async uploadDocument(@Body() body: CreateVirtualDocument.Parameters): Promise<CreateVirtualDocument.Response> {
		const newDocument = await this.uploadingOfNewDocumentAction.execute(
			body.name,
			body.description,
			body.file.originalName,
			new Uint8Array(body.file.buffer),
		);

		return {
			id: newDocument.virtualDocument.id,
			name: newDocument.virtualDocument.name,
			description: newDocument.virtualDocument.description,
			createdAt: newDocument.virtualDocument.createdAt,
			updatedAt: newDocument.virtualDocument.updatedAt,
			associatedStoredDocumentEntry: {
				id: newDocument.storedDocumentEntry.id,
				storedAt: newDocument.storedDocumentEntry.storedAt,
				originalFileName: newDocument.storedDocumentEntry.originalFileName,
			},
		};
	}

	@Post("upload-additional-file")
	@FormDataRequest()
	@ApiConsumes("multipart/form-data")
	@ApiResponse({ status: 200, type: UploadAdditionalFileToVirtualDocument.Response })
	async uploadAdditionalFile(
		@Body() body: UploadAdditionalFileToVirtualDocument.Parameters,
	): Promise<UploadAdditionalFileToVirtualDocument.Response> {
		const newDocument = await this.uploadingOfFileToExistingDocumentAction.execute(
			body.virtualDocumentId as VirtualDocument.Types.IdType,
			body.file.originalName,
			new Uint8Array(body.file.buffer),
		);

		return {
			id: newDocument.virtualDocument.id,
			name: newDocument.virtualDocument.name,
			description: newDocument.virtualDocument.description,
			createdAt: newDocument.virtualDocument.createdAt,
			updatedAt: newDocument.virtualDocument.updatedAt,
			associatedStoredDocumentEntry: {
				id: newDocument.storedDocumentEntry.id,
				storedAt: newDocument.storedDocumentEntry.storedAt,
				originalFileName: newDocument.storedDocumentEntry.originalFileName,
			},
		};
	}
}

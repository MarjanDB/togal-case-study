import { GetStoredDocumentsForVirtualDocuments } from "@contracts/Endpoints/GetStoredDocumentsForVirtualDocuments";
import { Controller, Get, Query } from "@nestjs/common";

@Controller("stored-documents")
export class GetStoredDocumentsForVirtualDocumentsController {
	@Get()
	async getStoredDocumentsForVirtualDocuments(
		@Query() query: GetStoredDocumentsForVirtualDocuments.GetParameters,
	): Promise<GetStoredDocumentsForVirtualDocuments.Response> {
		return {
			storedDocuments: [],
		};
	}
}

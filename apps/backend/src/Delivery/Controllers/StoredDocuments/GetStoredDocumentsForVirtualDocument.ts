import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { DateTime } from "luxon";

export namespace GetStoredDocumentsForVirtualDocument {
	@ApiSchema({ name: "GetStoredDocumentsForVirtualDocumentParameters" })
	export class GetParameters {
		@ApiProperty({
			description: "The ID of the virtual document to get stored documents for",
			type: "string",
		})
		@IsString()
		@IsNotEmpty()
		@IsUUID()
		virtualDocumentId!: string;
	}

	@ApiSchema({ name: "GetStoredDocumentsForVirtualDocumentResponse" })
	export class Response {
		@ApiProperty({
			description: "The stored documents for the virtual document",
			type: () => StoredDocumentForVirtualDocument,
		})
		storedDocuments!: StoredDocumentForVirtualDocument[];
	}

	@ApiSchema({ name: "GetStoredDocumentsForVirtualDocumentResponse StoredDocumentForVirtualDocument" })
	export class StoredDocumentForVirtualDocument {
		@ApiProperty({
			description: "The ID of the stored document",
			type: "string",
		})
		id!: string;

		@ApiProperty({
			description: "The date and time the document was stored",
			type: "string",
		})
		storedAt!: DateTime;

		@ApiProperty({
			description: "The original file name of the document",
			type: "string",
		})
		originalFileName!: string;

		@ApiProperty({
			description: "The ID of the virtual document the document belongs to",
			type: "string",
		})
		virtualDocumentId!: string;
	}
}

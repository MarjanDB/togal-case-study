import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";
import { DateTime } from "luxon";

export namespace GetVirtualDocuments {
	@ApiSchema({ name: "GetVirtualDocuments" })
	export class Parameters {
		@ApiProperty({
			description: "The ID of the virtual document to get stored documents for",
			type: "string",
			isArray: true,
		})
		@IsArray()
		@IsString({ each: true })
		virtualDocumentIds!: string[];
	}

	@ApiSchema({ name: "GetVirtualDocumentsResponse" })
	export class Response {
		@ApiProperty({
			description: "The virtual documents for the virtual folder",
			type: () => VirtualDocument,
			isArray: true,
		})
		virtualDocuments!: VirtualDocument[];
	}

	@ApiSchema({ name: "GetVirtualDocumentsResponse MostRecentStoredDocument" })
	export class MostRecentStoredDocument {
		@ApiProperty({
			description: "The ID of the stored document",
			type: "string",
		})
		id!: string;

		@ApiProperty({
			description: "The date and time the stored document was stored",
			type: "string",
		})
		storedAt!: DateTime;

		@ApiProperty({
			description: "The original file name of the stored document",
			type: "string",
		})
		originalFileName!: string;
	}

	@ApiSchema({ name: "GetVirtualDocumentsResponse VirtualDocument" })
	export class VirtualDocument {
		@ApiProperty({
			description: "The ID of the virtual document",
			type: "string",
		})
		id!: string;

		@ApiProperty({
			description: "The name of the virtual document",
			type: "string",
		})
		name!: string;

		@ApiProperty({
			description: "The description of the virtual document",
			type: "string",
			nullable: true,
		})
		description!: string | null;

		@ApiProperty({
			description: "The date and time the virtual document was created",
			type: "string",
		})
		createdAt!: DateTime;

		@ApiProperty({
			description: "The date and time the virtual document was updated",
			type: "string",
		})
		updatedAt!: DateTime;

		@ApiProperty({
			description: "The most recent stored document for the virtual document",
			type: () => MostRecentStoredDocument,
		})
		mostRecentStoredDocument!: MostRecentStoredDocument;
	}
}

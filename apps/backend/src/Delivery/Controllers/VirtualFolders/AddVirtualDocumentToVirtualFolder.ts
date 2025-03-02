import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { DateTime } from "luxon";

export namespace AddVirtualDocumentToVirtualFolder {
	@ApiSchema({ name: "AddVirtualDocumentToVirtualFolderParameters" })
	export class Parameters {
		@ApiProperty({
			description: "The ID of the virtual folder to add the virtual document to",
			type: "string",
		})
		virtualFolderId!: string;

		@ApiProperty({
			description: "The IDs of the virtual documents to add to the virtual folder",
			type: "string",
			isArray: true,
		})
		virtualDocumentIds!: string[];
	}

	@ApiSchema({ name: "CreateVirtualFolderResponse" })
	export class Response {
		@ApiProperty({
			description: "The ID of the virtual folder",
			type: "string",
		})
		id!: string;

		@ApiProperty({
			description: "The name of the virtual folder",
			type: "string",
		})
		name!: string;

		@ApiProperty({
			description: "The date and time the virtual folder was created",
			type: "string",
		})
		createdAt!: DateTime;

		@ApiProperty({
			description: "The date and time the virtual folder was updated",
			type: "string",
		})
		updatedAt!: DateTime;

		@ApiProperty({
			description: "The virtual documents in the virtual folder",
			type: "string",
			isArray: true,
		})
		virtualDocumentIds!: string[];
	}
}

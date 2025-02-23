import { ApiProperty } from "@nestjs/swagger";
import { DateTime } from "luxon";

export namespace CreateVirtualDocument {
	export class Parameters {
		@ApiProperty({
			description: "The name of the virtual document to create",
			type: "string",
		})
		name!: string;

		@ApiProperty({
			description: "The description of the virtual document to create",
			type: "string",
			nullable: true,
		})
		description!: string | null;

		@ApiProperty({
			description: "The ID of the virtual folder the virtual document belongs to",
			type: "string",
		})
		virtualFolderId!: string;

		@ApiProperty({
			description: "The file to upload for the virtual document",
			type: "string",
		})
		file!: Express.Multer.File;
	}

	export class Response {
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
			description: "The date and time the virtual document was last updated",
			type: "string",
		})
		updatedAt!: DateTime;
	}
}

import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { DateTime } from "luxon";
import { IsFile, MemoryStoredFile } from "nestjs-form-data";

export namespace CreateVirtualDocument {
	@ApiSchema({ name: "CreateVirtualDocumentRequest" })
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
			format: "binary",
		})
		@IsFile()
		file!: MemoryStoredFile;
	}

	@ApiSchema({ name: "CreateVirtualDocumentResponse AssociatedStoredDocumentEntry" })
	export class AssociatedStoredDocumentEntry {
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

	@ApiSchema({ name: "CreateVirtualDocumentResponse" })
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

		@ApiProperty({
			description: "The stored document entry associated with the virtual document",
			type: () => AssociatedStoredDocumentEntry,
		})
		associatedStoredDocumentEntry!: AssociatedStoredDocumentEntry;
	}
}

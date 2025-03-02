import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export namespace DownloadStoredDocument {
	@ApiSchema({ name: "DownloadStoredDocumentParameters" })
	export class Parameters {
		@ApiProperty({
			description: "The ID of the stored document to download",
			type: "string",
		})
		@IsString()
		@IsNotEmpty()
		@IsUUID()
		storedDocumentId!: string;
	}
}

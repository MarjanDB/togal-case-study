import { ApiProperty, ApiSchema } from "@nestjs/swagger";

export namespace DownloadStoredDocument {
	@ApiSchema({ name: "DownloadStoredDocumentParameters" })
	export class GetParameters {
		@ApiProperty({
			description: "The ID of the stored document to download",
			type: "string",
		})
		storedDocument!: string;
	}
}

import { ApiProperty } from "@nestjs/swagger";

export namespace DownloadStoredDocument {
	export class GetParameters {
		@ApiProperty({
			description: "The ID of the stored document to download",
			type: "string",
		})
		storedDocument!: string;
	}
}

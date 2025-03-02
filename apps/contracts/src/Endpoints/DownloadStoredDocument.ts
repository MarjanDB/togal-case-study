import { ApiProperty } from "@nestjs/swagger";

export namespace DownloadStoredDocument {
	export class Parameters {
		@ApiProperty({
			description: "The ID of the stored document to download",
			type: "string",
		})
		storedDocument!: string;
	}
}

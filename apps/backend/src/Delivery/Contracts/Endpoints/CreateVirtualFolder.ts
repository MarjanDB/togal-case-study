import { ApiProperty } from "@nestjs/swagger";
import { DateTime } from "luxon";

export namespace CreateVirtualFolder {
	export class Parameters {
		@ApiProperty({
			description: "The name of the virtual folder to create",
			type: "string",
		})
		name!: string;
	}

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
			description: "The date and time the virtual folder was last updated",
			type: "string",
		})
		updatedAt!: DateTime;
	}
}

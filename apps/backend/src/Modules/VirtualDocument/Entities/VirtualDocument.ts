import { Nominal } from "@backend/Utils/NominalType";
import { UUID } from "crypto";
import { DateTime } from "luxon";
import typia from "typia";

export type VirtualDocumentId = Nominal<UUID, "VirtualDocumentId">;

export type VirtualDocumentHash = Nominal<string, "VirtualDocumentHash">;

export class VirtualDocument {
	public constructor(
		public readonly id: VirtualDocumentId,
		public readonly name: string,
		public readonly description: string | null,
		public readonly createdAt: DateTime,
		public readonly updatedAt: DateTime,
		public readonly deletedAt: DateTime | null,
		public readonly type: VirtualDocumentType,
	) {}

	public static fromDto(dto: VirtualDocumentDto): VirtualDocument {
		return new VirtualDocument(dto.id, dto.name, dto.description, dto.created_at, dto.updated_at, dto.deleted_at, dto.type);
	}

	public static toDto(document: VirtualDocument): VirtualDocumentDto {
		return {
			id: document.id,
			name: document.name,
			description: document.description,
			created_at: document.createdAt,
			updated_at: document.updatedAt,
			deleted_at: document.deletedAt,
			type: document.type,
		};
	}
}

export interface VirtualDocumentDto {
	id: VirtualDocumentId;
	name: string;
	description: string | null;
	created_at: DateTime;
	updated_at: DateTime;
	deleted_at: DateTime | null;
	type: VirtualDocumentType;
}

export const VirtualDocumentDto = {
	asserter: typia.createAssert<VirtualDocumentDto>(),
	asserterArray: typia.createAssert<VirtualDocumentDto[]>(),
};

export const enum VirtualDocumentType {
	PDF = "pdf",
	WORD = "word",
	EXCEL = "excel",
}

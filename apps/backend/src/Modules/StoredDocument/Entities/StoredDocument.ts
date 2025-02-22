import { Nominal } from "@backend/Utils/NominalType";
import { UUID } from "crypto";
import { DateTime } from "luxon";
import typia from "typia";

export type StoredDocumentId = Nominal<UUID, "StoredDocumentId">;

export type StoredDocumentHash = Nominal<string, "StoredDocumentHash">;

export class StoredDocument {
	public constructor(
		public readonly id: StoredDocumentId,
		public readonly hash: StoredDocumentHash,
		public readonly storedAt: DateTime,
		public readonly originalFileName: string,
		public readonly data: Uint8Array,
	) {}

	public static fromDto(dto: StoredDocumentDto): StoredDocument {
		return new StoredDocument(dto.id, dto.hash, dto.stored_at, dto.original_file_name, dto.data);
	}

	public static toDto(document: StoredDocument): StoredDocumentDto {
		return {
			id: document.id,
			hash: document.hash,
			stored_at: document.storedAt,
			original_file_name: document.originalFileName,
			data: document.data,
		};
	}
}

export interface StoredDocumentDto {
	id: StoredDocumentId;
	hash: StoredDocumentHash;
	stored_at: DateTime;
	original_file_name: string;
	data: Uint8Array;
}

export const StoredDocumentDto = {
	asserter: typia.createAssert<StoredDocumentDto>(),
	asserterArray: typia.createAssert<StoredDocumentDto[]>(),
};

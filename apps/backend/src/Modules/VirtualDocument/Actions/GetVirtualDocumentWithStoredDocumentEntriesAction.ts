import { Inject, Injectable } from "@nestjs/common";
import { StoredDocument } from "Modules/StoredDocument/Entities/StoredDocument";
import { StoredDocumentEntry } from "Modules/StoredDocument/Entities/StoredDocumentEntry";
import { IVirtualDocumentProvider } from "Modules/VirtualDocument/Contracts/IVirtualDocumentProvider";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";

export namespace GetVirtualDocumentWithStoredDocumentEntriesAction {
	@Injectable()
	export class Action {
		public constructor(
			@Inject(IVirtualDocumentProvider.Interface)
			private readonly virtualDocumentProvider: IVirtualDocumentProvider.Interface,
		) {}

		public async execute(virtualDocumentId: VirtualDocument.Types.IdType): Promise<Types.VirtualDocumentLookup> {
			const virtualDocumentsAndStoredDocuments = await this.virtualDocumentProvider.findAllWithAssociatedStoredDocuments([
				virtualDocumentId,
			]);

			const virtualDocumentsWithStoredDocumentEntries: Types.VirtualDocumentLookup = {};

			for (const virtualDocument of virtualDocumentsAndStoredDocuments) {
				const entry =
					virtualDocumentsWithStoredDocumentEntries[virtualDocument.id as VirtualDocument.Types.IdType] ??
					new Types.VirtualDocumentWithStoredDocumentEntriesEntity(VirtualDocument.Entity.fromDto(virtualDocument), []);

				const storedDocument = new StoredDocumentEntry.Entity(
					virtualDocument.stored_document_id as StoredDocument.Types.IdType,
					virtualDocument.stored_document_hash as StoredDocument.Types.HashType,
					virtualDocument.stored_document_stored_at,
					virtualDocument.stored_document_original_file_name,
				);

				entry.storedDocumentEntries.push(storedDocument);

				virtualDocumentsWithStoredDocumentEntries[virtualDocument.id as VirtualDocument.Types.IdType] = entry;
			}

			return virtualDocumentsWithStoredDocumentEntries;
		}
	}

	export namespace Types {
		export class VirtualDocumentWithStoredDocumentEntriesEntity {
			public constructor(
				public readonly virtualDocument: VirtualDocument.Entity,
				public readonly storedDocumentEntries: StoredDocumentEntry.Entity[],
			) {}
		}

		export type VirtualDocumentLookup = Record<VirtualDocument.Types.IdType, VirtualDocumentWithStoredDocumentEntriesEntity>;
	}
}

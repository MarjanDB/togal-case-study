import { Inject, Injectable } from "@nestjs/common";
import { IStoredDocumentProvider } from "Modules/StoredDocument/Contracts/IStoredDocumentProvider";
import { StoredDocument } from "Modules/StoredDocument/Entities/StoredDocument";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { group } from "radashi";

export namespace FindStoredDocumentsBelongingToVirtualDocumentsAction {
	@Injectable()
	export class Action {
		public constructor(
			@Inject(IStoredDocumentProvider.Interface) private readonly storedDocumentProvider: IStoredDocumentProvider.Interface,
		) {}

		public async execute(virtualDocumentIds: VirtualDocument.Types.IdType[]): Promise<Types.VirtualDocumentLookup> {
			const result = await this.storedDocumentProvider.findForVirtualDocuments(virtualDocumentIds);

			const resultsWithStoredDocuments = result.map((item) => ({
				virtual_document_id: item.virtual_document_id,
				storedDocument: StoredDocument.Entity.fromDto(item),
			}));

			const storedDocumentsGroupedByVirtualDocumentId = group(resultsWithStoredDocuments, (item) => item.virtual_document_id);

			const lookup: Types.VirtualDocumentLookup = {};

			for (const [virtualDocumentId, storedDocuments] of Object.entries(storedDocumentsGroupedByVirtualDocumentId)) {
				lookup[virtualDocumentId as VirtualDocument.Types.IdType] = {};

				for (const storedDocument of storedDocuments ?? []) {
					lookup[virtualDocumentId as VirtualDocument.Types.IdType][storedDocument.storedDocument.id] = storedDocument.storedDocument;
				}
			}

			return lookup;
		}
	}

	export namespace Types {
		export type StoredDocumentLookup = Record<StoredDocument.Types.IdType, StoredDocument.Entity>;

		export type VirtualDocumentLookup = Record<VirtualDocument.Types.IdType, StoredDocumentLookup>;
	}
}

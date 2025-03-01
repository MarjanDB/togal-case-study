import { Inject, Injectable } from "@nestjs/common";
import { IStoredDocumentProvider } from "Modules/StoredDocument/Contracts/IStoredDocumentProvider";
import { StoredDocumentEntry } from "Modules/StoredDocument/Entities/StoredDocumentEntry";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";

export namespace FindMostRecentStoredDocumentBelongingToVirtualDocuments {
	@Injectable()
	export class Action {
		public constructor(
			@Inject(IStoredDocumentProvider.Interface) private readonly storedDocumentProvider: IStoredDocumentProvider.Interface,
		) {}

		public async execute(virtualDocumentIds: VirtualDocument.Types.IdType[]): Promise<Types.VirtualDocumentLookup> {
			const result = await this.storedDocumentProvider.findMostRecentStoredDocumentEntriesForVirtualDocuments(virtualDocumentIds);

			const resultsWithStoredDocuments = result.map((item) => ({
				virtualDocumentId: item.virtual_document_id,
				storedDocumentEntry: StoredDocumentEntry.Entity.fromDto(item),
			}));

			const lookup: Types.VirtualDocumentLookup = {};

			for (const item of resultsWithStoredDocuments) {
				lookup[item.virtualDocumentId as VirtualDocument.Types.IdType] = item.storedDocumentEntry;
			}

			return lookup;
		}
	}

	export namespace Types {
		export type VirtualDocumentLookup = Record<VirtualDocument.Types.IdType, StoredDocumentEntry.Entity>;
	}
}

import { Inject, Injectable } from "@nestjs/common";
import { FindMostRecentStoredDocumentBelongingToVirtualDocuments } from "Modules/StoredDocument/Actions/FindMostRecentStoredDocumentBelongingToVirtualDocumentsAction";
import { StoredDocumentEntry } from "Modules/StoredDocument/Entities/StoredDocumentEntry";
import { IVirtualDocumentProvider } from "Modules/VirtualDocument/Contracts/IVirtualDocumentProvider";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualFolder } from "Modules/VirtualFolder/Entities/VirtualFolder";

export namespace GetVirtualDocumentsWithMostRecentStoredDocumentsAction {
	@Injectable()
	export class Action {
		public constructor(
			@Inject(FindMostRecentStoredDocumentBelongingToVirtualDocuments.Action)
			private readonly findMostRecentStoredDocumentBelongingToVirtualDocumentAction: FindMostRecentStoredDocumentBelongingToVirtualDocuments.Action,
			@Inject(IVirtualDocumentProvider.Interface)
			private readonly virtualDocumentProvider: IVirtualDocumentProvider.Interface,
		) {}

		public async execute(virtualFolderId: VirtualFolder.Types.IdType): Promise<Types.VirtualDocumentLookup> {
			const virtualDocuments = await this.virtualDocumentProvider.findForVirtualFolder([virtualFolderId]);
			const virtualDocumentIds = virtualDocuments.map((virtualDocument) => virtualDocument.id as VirtualDocument.Types.IdType);

			const mostRecentStoredDocuments =
				await this.findMostRecentStoredDocumentBelongingToVirtualDocumentAction.execute(virtualDocumentIds);

			const virtualDocumentsWithMostRecentStoredDocuments: Types.VirtualDocumentLookup = {};

			for (const virtualDocument of virtualDocuments) {
				virtualDocumentsWithMostRecentStoredDocuments[virtualDocument.id as VirtualDocument.Types.IdType] =
					new Types.VirtualDocumentWithMostRecentStoredDocumentEntity(
						VirtualDocument.Entity.fromDto(virtualDocument),
						mostRecentStoredDocuments[virtualDocument.id as VirtualDocument.Types.IdType],
					);
			}

			return virtualDocumentsWithMostRecentStoredDocuments;
		}
	}

	export namespace Types {
		export class VirtualDocumentWithMostRecentStoredDocumentEntity {
			public constructor(
				public readonly virtualDocument: VirtualDocument.Entity,
				public readonly mostRecentStoredDocument: StoredDocumentEntry.Entity,
			) {}
		}

		export type VirtualDocumentWithMostRecentStoredDocument = VirtualDocument.Entity & {
			mostRecentStoredDocument: StoredDocumentEntry.Entity;
		};

		export type VirtualDocumentLookup = Record<VirtualDocument.Types.IdType, VirtualDocumentWithMostRecentStoredDocumentEntity>;
	}
}

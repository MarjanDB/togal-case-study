import { Inject, Injectable } from "@nestjs/common";
import { StoreNewDocumentAction } from "Modules/StoredDocument/Actions/StoreNewDocumentAction";
import { StoredDocumentEntry } from "Modules/StoredDocument/Entities/StoredDocumentEntry";
import { AssociateStoredDocumentWithVirtualDocumentAction } from "Modules/VirtualDocument/Actions/AssociateStoredDocumentWithVirtualDocumentAction";
import { IVirtualDocumentProvider } from "Modules/VirtualDocument/Contracts/IVirtualDocumentProvider";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";

export namespace UploadingOfFileToExistingDocumentAction {
	@Injectable()
	export class Action {
		public constructor(
			@Inject(StoreNewDocumentAction.Action)
			private readonly storeNewDocumentAction: StoreNewDocumentAction.Action,
			@Inject(AssociateStoredDocumentWithVirtualDocumentAction.Action)
			private readonly associateStoredDocumentWithVirtualDocumentAction: AssociateStoredDocumentWithVirtualDocumentAction.Action,
			@Inject(IVirtualDocumentProvider.Interface)
			private readonly virtualDocumentProvider: IVirtualDocumentProvider.Interface,
		) {}

		public async execute(
			virtualDocumentId: VirtualDocument.Types.IdType,
			originalFileName: string,
			data: Uint8Array,
		): Promise<Types.UploadingOfFileToExistingDocumentActionReturnType> {
			// To check if the virtual document even exists
			const virtualDocument = await this.virtualDocumentProvider.findById(virtualDocumentId);

			const newDocument = await this.storeNewDocumentAction.execute(originalFileName, data);

			await this.associateStoredDocumentWithVirtualDocumentAction.execute(virtualDocument.id, newDocument.id);

			const virtualDocumentStoredDocument = new Types.UploadingOfFileToExistingDocumentActionReturnType(virtualDocument, newDocument);

			return virtualDocumentStoredDocument;
		}
	}

	export namespace Types {
		export class UploadingOfFileToExistingDocumentActionReturnType {
			public constructor(
				public readonly virtualDocument: VirtualDocument.Entity,
				public readonly storedDocumentEntry: StoredDocumentEntry.Entity,
			) {}
		}
	}
}

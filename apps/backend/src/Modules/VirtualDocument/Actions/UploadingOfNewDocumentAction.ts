import { Inject, Injectable } from "@nestjs/common";
import { StoreNewDocumentAction } from "Modules/StoredDocument/Actions/StoreNewDocumentAction";
import { StoredDocumentEntry } from "Modules/StoredDocument/Entities/StoredDocumentEntry";
import { AssociateStoredDocumentWithVirtualDocumentAction } from "Modules/VirtualDocument/Actions/AssociateStoredDocumentWithVirtualDocumentAction";
import { CreateNewVirtualDocumentAction } from "Modules/VirtualDocument/Actions/CreateNewVirtualDocumentAction";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";

export namespace UploadingOfNewDocumentAction {
	@Injectable()
	export class Action {
		public constructor(
			@Inject(StoreNewDocumentAction.Action)
			private readonly storeNewDocumentAction: StoreNewDocumentAction.Action,
			@Inject(CreateNewVirtualDocumentAction.Action)
			private readonly createNewVirtualDocumentAction: CreateNewVirtualDocumentAction.Action,
			@Inject(AssociateStoredDocumentWithVirtualDocumentAction.Action)
			private readonly associateStoredDocumentWithVirtualDocumentAction: AssociateStoredDocumentWithVirtualDocumentAction.Action,
		) {}

		public async execute(
			fileName: string,
			description: string | null,
			originalFileName: string,
			data: Buffer,
		): Promise<UploadingOfNewDocumentAction.Types.UploadingOfNewDocumentActionReturnType> {
			const virtualDocument = await this.createNewVirtualDocumentAction.execute(
				fileName,
				description,
				VirtualDocument.Types.DocumentType.TEXT,
			);

			const newDocument = await this.storeNewDocumentAction.execute(originalFileName, data);

			await this.associateStoredDocumentWithVirtualDocumentAction.execute(virtualDocument.id, newDocument.id);

			const virtualDocumentStoredDocument = new UploadingOfNewDocumentAction.Types.UploadingOfNewDocumentActionReturnType(
				virtualDocument,
				newDocument,
			);

			return virtualDocumentStoredDocument;
		}
	}

	export namespace Types {
		export class UploadingOfNewDocumentActionReturnType {
			public constructor(
				public readonly virtualDocument: VirtualDocument.Entity,
				public readonly storedDocumentEntry: StoredDocumentEntry.Entity,
			) {}
		}
	}
}

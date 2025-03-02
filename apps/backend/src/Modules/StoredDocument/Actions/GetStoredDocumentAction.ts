import { Inject, Injectable } from "@nestjs/common";
import { IStoredDocumentProvider } from "Modules/StoredDocument/Contracts/IStoredDocumentProvider";
import { StoredDocument } from "Modules/StoredDocument/Entities/StoredDocument";

export namespace GetStoredDocumentAction {
	@Injectable()
	export class Action {
		public constructor(
			@Inject(IStoredDocumentProvider.Interface) private readonly storedDocumentProvider: IStoredDocumentProvider.Interface,
		) {}

		public async execute(id: StoredDocument.Types.IdType): Promise<StoredDocument.Entity> {
			return this.storedDocumentProvider.findById(id);
		}
	}
}

import { Inject, Injectable } from "@nestjs/common";
import { IStoredDocumentProvider } from "Modules/StoredDocument/Contracts/IStoredDocumentProvider";
import { StoredDocument } from "Modules/StoredDocument/Entities/StoredDocument";

export namespace CheckForExistingStoredDocumentAction {
	@Injectable()
	export class Action {
		public constructor(
			@Inject(IStoredDocumentProvider.Interface) private readonly storedDocumentProvider: IStoredDocumentProvider.Interface,
		) {}

		public async execute(hash: StoredDocument.Types.HashType): Promise<boolean> {
			try {
				await this.storedDocumentProvider.findByHash(hash);
				return true;
			} catch (_error) {
				return false;
			}
		}
	}
}

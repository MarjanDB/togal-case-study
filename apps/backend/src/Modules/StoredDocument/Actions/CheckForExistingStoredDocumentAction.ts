import { Inject, Injectable } from "@nestjs/common";
import { IStoredDocumentProvider } from "Modules/StoredDocument/Contracts/IStoredDocumentProvider";
import { StoredDocumentHash } from "Modules/StoredDocument/Entities/StoredDocument";

@Injectable()
export class CheckForExistingStoredDocumentAction {
	public constructor(@Inject(IStoredDocumentProvider) private readonly storedDocumentProvider: IStoredDocumentProvider) {}

	public async execute(hash: StoredDocumentHash): Promise<boolean> {
		try {
			await this.storedDocumentProvider.findByHash(hash);
			return true;
		} catch (_error) {
			return false;
		}
	}
}

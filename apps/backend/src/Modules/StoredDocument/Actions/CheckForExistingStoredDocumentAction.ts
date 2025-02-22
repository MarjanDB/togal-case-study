import { StoredDocumentHash } from "@backend/Modules/StoredDocument/Entities/StoredDocument";
import { StoredDocumentProvider } from "@backend/Modules/StoredDocument/Providers/StoredDocumentProvider";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CheckForExistingStoredDocumentAction {
	public constructor(@Inject(StoredDocumentProvider) private readonly storedDocumentProvider: StoredDocumentProvider) {}

	public async execute(hash: StoredDocumentHash): Promise<boolean> {
		try {
			await this.storedDocumentProvider.findByHash(hash);
			return true;
		} catch (_error) {
			return false;
		}
	}
}

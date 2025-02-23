import { IStoredDocumentProvider } from "@backend/Modules/StoredDocument/Contracts/IStoredDocumentProvider";
import { StoredDocumentHash } from "@backend/Modules/StoredDocument/Entities/StoredDocument";
import { Inject, Injectable } from "@nestjs/common";

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

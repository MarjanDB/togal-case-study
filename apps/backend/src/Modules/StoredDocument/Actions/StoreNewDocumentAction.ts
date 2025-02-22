import { CheckForExistingStoredDocumentAction } from "@backend/Modules/StoredDocument/Actions/CheckForExistingStoredDocumentAction";
import { StoredDocument, StoredDocumentHash, StoredDocumentId } from "@backend/Modules/StoredDocument/Entities/StoredDocument";
import { StoredDocumentProvider } from "@backend/Modules/StoredDocument/Providers/StoredDocumentProvider";
import { ITimeProvider } from "@backend/Providers/TimeProvider/Contracts/ITimeProvider";
import { IUniqueIdentifierProvider } from "@backend/Providers/UniqueIdentifierProvider/Contracts/IUniqueIdentifierProvider";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class StoreNewDocumentAction {
	public constructor(
		private readonly checkForExistingStoredDocumentAction: CheckForExistingStoredDocumentAction,
		@Inject(StoredDocumentProvider) private readonly storedDocumentProvider: StoredDocumentProvider,
		@Inject(CheckForExistingStoredDocumentAction)
		@Inject(IUniqueIdentifierProvider)
		private readonly uniqueIdentifierProvider: IUniqueIdentifierProvider,
		@Inject(ITimeProvider) private readonly timeProvider: ITimeProvider,
	) {}

	public async execute(fileName: string, data: Uint8Array): Promise<StoredDocument> {
		const textDecoder = new TextDecoder();
		const dataHash: StoredDocumentHash = <StoredDocumentHash>textDecoder.decode(await crypto.subtle.digest("SHA-256", data));

		const existingDocument = await this.checkForExistingStoredDocumentAction.execute(dataHash);

		if (existingDocument) {
			throw new BadRequestException("Document already exists");
		}

		const uuid = this.uniqueIdentifierProvider.getUniqueIdentifier<StoredDocumentId>();

		const document = new StoredDocument(uuid, dataHash, this.timeProvider.getTime(), fileName, data);

		await this.storedDocumentProvider.create(document);

		return document;
	}
}

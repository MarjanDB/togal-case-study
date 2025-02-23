import { CheckForExistingStoredDocumentAction } from "@backend/Modules/StoredDocument/Actions/CheckForExistingStoredDocumentAction";
import { IStoredDocumentProvider } from "@backend/Modules/StoredDocument/Contracts/IStoredDocumentProvider";
import { StoredDocument, StoredDocumentHash, StoredDocumentId } from "@backend/Modules/StoredDocument/Entities/StoredDocument";
import { ITimeProvider } from "@backend/Providers/TimeProvider/Contracts/ITimeProvider";
import { IUniqueIdentifierProvider } from "@backend/Providers/UniqueIdentifierProvider/Contracts/IUniqueIdentifierProvider";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class StoreNewDocumentAction {
	public constructor(
		@Inject(CheckForExistingStoredDocumentAction)
		private readonly checkForExistingStoredDocumentAction: CheckForExistingStoredDocumentAction,
		@Inject(IStoredDocumentProvider)
		private readonly storedDocumentProvider: IStoredDocumentProvider,
		@Inject(IUniqueIdentifierProvider)
		private readonly uniqueIdentifierProvider: IUniqueIdentifierProvider,
		@Inject(ITimeProvider)
		private readonly timeProvider: ITimeProvider,
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

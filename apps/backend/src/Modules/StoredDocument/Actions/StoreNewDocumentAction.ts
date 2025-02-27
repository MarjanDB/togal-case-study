import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CheckForExistingStoredDocumentAction } from "Modules/StoredDocument/Actions/CheckForExistingStoredDocumentAction";
import { IStoredDocumentProvider } from "Modules/StoredDocument/Contracts/IStoredDocumentProvider";
import { StoredDocument, StoredDocumentHash, StoredDocumentId } from "Modules/StoredDocument/Entities/StoredDocument";
import { ITimeProvider } from "Providers/TimeProvider/Contracts/ITimeProvider";
import { IUniqueIdentifierProvider } from "Providers/UniqueIdentifierProvider/Contracts/IUniqueIdentifierProvider";

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

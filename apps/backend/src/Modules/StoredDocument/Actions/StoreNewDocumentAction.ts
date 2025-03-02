import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CheckForExistingStoredDocumentByHashAction } from "Modules/StoredDocument/Actions/CheckForExistingStoredDocumentByHashAction";
import { IStoredDocumentProvider } from "Modules/StoredDocument/Contracts/IStoredDocumentProvider";
import { StoredDocument } from "Modules/StoredDocument/Entities/StoredDocument";
import { ITimeProvider } from "Providers/TimeProvider/Contracts/ITimeProvider";
import { IUniqueIdentifierProvider } from "Providers/UniqueIdentifierProvider/Contracts/IUniqueIdentifierProvider";

export namespace StoreNewDocumentAction {
	@Injectable()
	export class Action {
		public constructor(
			@Inject(CheckForExistingStoredDocumentByHashAction.Action)
			private readonly checkForExistingStoredDocumentAction: CheckForExistingStoredDocumentByHashAction.Action,
			@Inject(IStoredDocumentProvider.Interface)
			private readonly storedDocumentProvider: IStoredDocumentProvider.Interface,
			@Inject(IUniqueIdentifierProvider)
			private readonly uniqueIdentifierProvider: IUniqueIdentifierProvider,
			@Inject(ITimeProvider)
			private readonly timeProvider: ITimeProvider,
		) {}

		public async execute(fileName: string, data: Buffer): Promise<StoredDocument.Entity> {
			const textDecoder = new TextDecoder();
			const dataHash: StoredDocument.Types.HashType = <StoredDocument.Types.HashType>(
				textDecoder.decode(await crypto.subtle.digest("SHA-256", data))
			);

			const existingDocument = await this.checkForExistingStoredDocumentAction.execute(dataHash);

			if (existingDocument) {
				throw new BadRequestException("Document already exists");
			}

			const uuid = this.uniqueIdentifierProvider.getUniqueIdentifier<StoredDocument.Types.IdType>();

			const document = new StoredDocument.Entity(uuid, dataHash, this.timeProvider.getTime(), fileName, data);

			await this.storedDocumentProvider.create(document);

			return document;
		}
	}
}

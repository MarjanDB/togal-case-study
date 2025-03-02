import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IStoredDocumentProvider } from "Modules/StoredDocument/Contracts/IStoredDocumentProvider";
import { StoredDocument } from "Modules/StoredDocument/Entities/StoredDocument";

export namespace CheckForExistingStoredDocumentByIdAction {
	@Injectable()
	export class Action {
		public constructor(
			@Inject(IStoredDocumentProvider.Interface) private readonly storedDocumentProvider: IStoredDocumentProvider.Interface,
		) {}

		public async execute(id: StoredDocument.Types.IdType): Promise<boolean> {
			try {
				await this.storedDocumentProvider.findById(id);
				return true;
			} catch (error) {
				if (error instanceof NotFoundException) {
					return false;
				}

				throw error;
			}
		}
	}
}

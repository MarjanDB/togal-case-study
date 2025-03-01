import { Inject, Injectable } from "@nestjs/common";
import { IVirtualDocumentProvider } from "Modules/VirtualDocument/Contracts/IVirtualDocumentProvider";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { ITimeProvider } from "Providers/TimeProvider/Contracts/ITimeProvider";
import { IUniqueIdentifierProvider } from "Providers/UniqueIdentifierProvider/Contracts/IUniqueIdentifierProvider";

export namespace CreateNewVirtualDocumentAction {
	@Injectable()
	export class Action {
		public constructor(
			@Inject(IVirtualDocumentProvider.Interface) private readonly virtualDocumentProvider: IVirtualDocumentProvider.Interface,
			@Inject(IUniqueIdentifierProvider) private readonly uniqueIdentifierProvider: IUniqueIdentifierProvider,
			@Inject(ITimeProvider) private readonly timeProvider: ITimeProvider,
		) {}

		public async execute(
			name: string,
			description: string | null,
			type: VirtualDocument.Types.DocumentType,
		): Promise<VirtualDocument.Entity> {
			const uuid = this.uniqueIdentifierProvider.getUniqueIdentifier<VirtualDocument.Types.IdType>();
			const now = this.timeProvider.getTime();

			const virtualDocument = new VirtualDocument.Entity(uuid, name, description, now, now, null, type);

			await this.virtualDocumentProvider.create(virtualDocument);

			return virtualDocument;
		}
	}
}

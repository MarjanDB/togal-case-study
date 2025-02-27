import { Inject, Injectable } from "@nestjs/common";
import { IVirtualDocumentProvider } from "Modules/VirtualDocument/Contracts/IVirtualDocumentProvider";
import { VirtualDocument, VirtualDocumentId, VirtualDocumentType } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { ITimeProvider } from "Providers/TimeProvider/Contracts/ITimeProvider";
import { IUniqueIdentifierProvider } from "Providers/UniqueIdentifierProvider/Contracts/IUniqueIdentifierProvider";

@Injectable()
export class CreateNewVirtualDocumentAction {
	public constructor(
		@Inject(IVirtualDocumentProvider) private readonly virtualDocumentProvider: IVirtualDocumentProvider,
		@Inject(IUniqueIdentifierProvider) private readonly uniqueIdentifierProvider: IUniqueIdentifierProvider,
		@Inject(ITimeProvider) private readonly timeProvider: ITimeProvider,
	) {}

	public async execute(name: string, description: string | null, type: VirtualDocumentType): Promise<VirtualDocument> {
		const uuid = this.uniqueIdentifierProvider.getUniqueIdentifier<VirtualDocumentId>();
		const now = this.timeProvider.getTime();

		const virtualDocument = new VirtualDocument(uuid, name, description, now, now, null, type);

		await this.virtualDocumentProvider.create(virtualDocument);

		return virtualDocument;
	}
}

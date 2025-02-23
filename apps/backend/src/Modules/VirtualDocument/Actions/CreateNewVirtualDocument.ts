import { VirtualDocument, VirtualDocumentId, VirtualDocumentType } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualDocumentProvider } from "@backend/Modules/VirtualDocument/Providers/VirtualDocumentProvider";
import { ITimeProvider } from "@backend/Providers/TimeProvider/Contracts/ITimeProvider";
import { IUniqueIdentifierProvider } from "@backend/Providers/UniqueIdentifierProvider/Contracts/IUniqueIdentifierProvider";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CreateNewVirtualDocumentAction {
	public constructor(
		@Inject(VirtualDocumentProvider) private readonly virtualDocumentProvider: VirtualDocumentProvider,
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

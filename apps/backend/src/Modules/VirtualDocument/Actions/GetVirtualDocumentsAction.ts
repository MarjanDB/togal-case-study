import { IVirtualDocumentProvider } from "@backend/Modules/VirtualDocument/Contracts/IVirtualDocumentProvider";
import { VirtualDocument, VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetVirtualDocumentsAction {
	public constructor(@Inject(IVirtualDocumentProvider) private readonly virtualDocumentProvider: IVirtualDocumentProvider) {}

	public async execute(ids: VirtualDocumentId[]): Promise<VirtualDocument[]> {
		return this.virtualDocumentProvider.findByIds(ids);
	}
}

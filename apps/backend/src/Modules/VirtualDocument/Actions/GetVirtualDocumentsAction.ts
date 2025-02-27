import { Inject, Injectable } from "@nestjs/common";
import { IVirtualDocumentProvider } from "Modules/VirtualDocument/Contracts/IVirtualDocumentProvider";
import { VirtualDocument, VirtualDocumentId } from "Modules/VirtualDocument/Entities/VirtualDocument";

@Injectable()
export class GetVirtualDocumentsAction {
	public constructor(@Inject(IVirtualDocumentProvider) private readonly virtualDocumentProvider: IVirtualDocumentProvider) {}

	public async execute(ids: VirtualDocumentId[]): Promise<VirtualDocument[]> {
		return this.virtualDocumentProvider.findByIds(ids);
	}
}

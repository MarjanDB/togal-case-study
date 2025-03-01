import { Inject, Injectable } from "@nestjs/common";
import { IVirtualDocumentProvider } from "Modules/VirtualDocument/Contracts/IVirtualDocumentProvider";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";

export namespace GetVirtualDocumentsAction {
	@Injectable()
	export class Action {
		public constructor(
			@Inject(IVirtualDocumentProvider.Interface) private readonly virtualDocumentProvider: IVirtualDocumentProvider.Interface,
		) {}

		public async execute(ids: VirtualDocument.Types.IdType[]): Promise<VirtualDocument.Entity[]> {
			return await this.virtualDocumentProvider.findByIds(ids);
		}
	}
}

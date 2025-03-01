import { Inject, Injectable } from "@nestjs/common";
import { IVirtualFolderProvider } from "Modules/VirtualFolder/Contracts/IVirtualFolderProvider";
import { VirtualFolder } from "Modules/VirtualFolder/Entities/VirtualFolder";
import { ITimeProvider } from "Providers/TimeProvider/Contracts/ITimeProvider";
import { IUniqueIdentifierProvider } from "Providers/UniqueIdentifierProvider/Contracts/IUniqueIdentifierProvider";

export namespace CreateVirtualFolderAction {
	@Injectable()
	export class Action {
		public constructor(
			@Inject(IVirtualFolderProvider.Interface) private readonly virtualFolderProvider: IVirtualFolderProvider.Interface,
			@Inject(ITimeProvider) private readonly timeProvider: ITimeProvider,
			@Inject(IUniqueIdentifierProvider) private readonly identifierProvider: IUniqueIdentifierProvider,
		) {}

		public async execute(name: string): Promise<VirtualFolder.Entity> {
			const id = this.identifierProvider.getUniqueIdentifier<VirtualFolder.Types.IdType>();
			const createdAt = this.timeProvider.getTime();
			const updatedAt = createdAt;

			const virtualFolder = new VirtualFolder.Entity(id, name, createdAt, updatedAt, null);

			await this.virtualFolderProvider.create(virtualFolder);

			return virtualFolder;
		}
	}
}

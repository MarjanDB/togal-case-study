import { Inject, Injectable } from "@nestjs/common";
import { IVirtualFolderProvider } from "Modules/VirtualFolder/Contracts/IVirtualFolderProvider";
import { VirtualFolder, VirtualFolderId } from "Modules/VirtualFolder/Entities/VirtualFolder";
import { ITimeProvider } from "Providers/TimeProvider/Contracts/ITimeProvider";
import { IUniqueIdentifierProvider } from "Providers/UniqueIdentifierProvider/Contracts/IUniqueIdentifierProvider";

@Injectable()
export class CreateVirtualFolderAction {
	public constructor(
		@Inject(IVirtualFolderProvider) private readonly virtualFolderProvider: IVirtualFolderProvider,
		@Inject(ITimeProvider) private readonly timeProvider: ITimeProvider,
		@Inject(IUniqueIdentifierProvider) private readonly identifierProvider: IUniqueIdentifierProvider,
	) {}

	public async execute(name: string): Promise<VirtualFolder> {
		const id = this.identifierProvider.getUniqueIdentifier<VirtualFolderId>();
		const createdAt = this.timeProvider.getTime();
		const updatedAt = createdAt;

		const virtualFolder = new VirtualFolder(id, name, createdAt, updatedAt, null);

		await this.virtualFolderProvider.create(virtualFolder);

		return virtualFolder;
	}
}

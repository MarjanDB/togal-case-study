import { VirtualFolder, VirtualFolderId } from "@backend/Modules/VirtualFolder/Entities/VirtualFolder";
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class IVirtualFolderProvider {
	abstract create(folder: VirtualFolder): Promise<void>;
	abstract findById(id: VirtualFolderId): Promise<VirtualFolder>;
	abstract findByIds(ids: VirtualFolderId[]): Promise<VirtualFolder[]>;
	abstract findAll(): Promise<VirtualFolder[]>;
}

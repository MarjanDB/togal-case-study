import { Injectable } from "@nestjs/common";
import { VirtualFolder } from "Modules/VirtualFolder/Entities/VirtualFolder";
import typia from "typia";

export namespace IVirtualFolderProvider {
	@Injectable()
	export abstract class Interface {
		abstract create(folder: VirtualFolder.Entity): Promise<void>;
		abstract findById(id: VirtualFolder.Types.IdType): Promise<VirtualFolder.Entity>;
		abstract findByIds(ids: VirtualFolder.Types.IdType[]): Promise<VirtualFolder.Entity[]>;
		abstract findAll(): Promise<VirtualFolder.Entity[]>;
		abstract findAllWithAssociatedVirtualDocuments(): Promise<Types.VirtualFolderWithAssociatedVirtualDocumentsQuery[]>;
		abstract findbyIdsWithAssociatedVirtualDocuments(
			ids: VirtualFolder.Types.IdType[],
		): Promise<Types.VirtualFolderWithAssociatedVirtualDocumentsQuery[]>;
		abstract update(folders: (Pick<VirtualFolder.Types.Dto, "id"> & Partial<VirtualFolder.Types.Dto>)[]): Promise<void>;
	}

	export namespace Types {
		export type VirtualFolderWithAssociatedVirtualDocumentsQuery = VirtualFolder.Types.Dto & {
			virtual_document_id: string | null;
		};

		export const VirtualFolderWithAssociatedVirtualDocumentsQuery = {
			asserter: typia.createAssert<VirtualFolderWithAssociatedVirtualDocumentsQuery>(),
			asserterArray: typia.createAssert<VirtualFolderWithAssociatedVirtualDocumentsQuery[]>(),
		};
	}
}

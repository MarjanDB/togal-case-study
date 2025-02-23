import { VirtualDocument, VirtualDocumentId } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class IVirtualDocumentProvider {
	abstract create(document: VirtualDocument): Promise<void>;
	abstract findById(id: VirtualDocumentId): Promise<VirtualDocument>;
}

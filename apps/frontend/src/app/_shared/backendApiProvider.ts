import { DownloadStoredDocument } from "./contracts/StoredDocuments/DownloadStoredDocument";
import { GetStoredDocumentsForVirtualDocument } from "./contracts/StoredDocuments/GetStoredDocumentsForVirtualDocument";
import { GetVirtualDocuments } from "./contracts/VirtualDocuments/GetVirtualDocuments";
import { UploadAdditionalFileToVirtualDocument } from "./contracts/VirtualDocuments/UploadAdditionalFileToVirtualDocument";
import { StoredDocumentEntry } from "./entities/StoredDocumentEntry";
import { VirtualDocument } from "./entities/VirtualDocument";

export class BackendApiProvider {
	private static readonly API_URL = `http://localhost:3001/api`;

	public static async getVirtualDocument(req: GetVirtualDocuments.Parameters): Promise<VirtualDocument.Entity> {
		const response = await fetch(`${this.API_URL}/virtual-documents/get-documents`, {
			method: "POST",
			body: JSON.stringify(req),
			headers: {
				"Content-Type": "application/json",
			},
		});

		const responseJson = (await response.json()) as GetVirtualDocuments.Response;

		return VirtualDocument.Entity.fromDto(responseJson.virtualDocuments[0]);
	}

	public static async getStoredDocumentsForVirtualDocument(
		req: GetStoredDocumentsForVirtualDocument.Parameters,
	): Promise<StoredDocumentEntry.Entity[]> {
		const response = await fetch(
			`${this.API_URL}/stored-documents/get-stored-documents-for-virtual-document?virtualDocumentId=${req.virtualDocumentId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		const responseJson = (await response.json()) as GetStoredDocumentsForVirtualDocument.Response;

		return responseJson.storedDocuments.map((storedDocument) => StoredDocumentEntry.Entity.fromDto(storedDocument));
	}

	public static getStoredDocumentDownloadUrl(req: DownloadStoredDocument.Parameters): string {
		return `${this.API_URL}/stored-documents/download-stored-document?storedDocumentId=${req.storedDocumentId}`;
	}

	public static async uploadAdditionalFileToVirtualDocument(
		req: UploadAdditionalFileToVirtualDocument.Parameters,
	): Promise<StoredDocumentEntry.Entity> {
		const formData = new FormData();
		formData.append("virtualDocumentId", req.virtualDocumentId);
		formData.append("file", req.file);

		const response = await fetch(`${this.API_URL}/virtual-documents/upload-additional-file`, {
			method: "POST",
			body: formData,
		});

		const responseJson = (await response.json()) as UploadAdditionalFileToVirtualDocument.Response;

		return StoredDocumentEntry.Entity.fromDto(responseJson.associatedStoredDocumentEntry);
	}
}

"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { BackendApiProvider } from "../../../../_shared/backendApiProvider";
import { StoredDocumentEntry } from "../../../../_shared/entities/StoredDocumentEntry";
import { VirtualDocument } from "../../../../_shared/entities/VirtualDocument";
import FilePickerComponent, { FilePickerProps } from "./FilePicker";
import StoredDocumentListItem from "./StoredDocumentListItem";

export default function VirtualDocumentComponent(params: { id: string }) {
	const [virtualDocument, setVirtualDocument] = useState<VirtualDocument.Entity | null>(null);
	const [storedDocuments, setStoredDocuments] = useState<StoredDocumentEntry.Entity[] | null>(null);

	useEffect(() => {
		const fetchVirtualDocument = async () => {
			const virtualDocument = await BackendApiProvider.getVirtualDocument({ virtualDocumentIds: [params.id] });
			setVirtualDocument(virtualDocument);
		};
		fetchVirtualDocument();
	}, []);

	useEffect(() => {
		if (!virtualDocument) {
			return;
		}

		const fetchStoredDocuments = async () => {
			const storedDocuments = await BackendApiProvider.getStoredDocumentsForVirtualDocument({
				virtualDocumentId: virtualDocument.id,
			});
			setStoredDocuments(storedDocuments);
		};

		fetchStoredDocuments();
	}, [virtualDocument]);

	const getStoredDocumentDownloadUrl = (storedDocumentId: string) => {
		return BackendApiProvider.getStoredDocumentDownloadUrl({ storedDocumentId });
	};

	if (!virtualDocument) {
		return <p>Loading...</p>;
	}

	const onUpload: FilePickerProps["onUpload"] = async (file: File, onUploaded: () => void) => {
		const storedDocumentEntry = await BackendApiProvider.uploadAdditionalFileToVirtualDocument({
			virtualDocumentId: virtualDocument.id,
			file,
		});

		// Above API call could fail, and we'd have to handle that using some kind of onError callback exposed
		// from file picker that wouldn't reset the picked file, but allow another attempt at uploading

		setStoredDocuments([...(storedDocuments ?? []), storedDocumentEntry]);

		const currentVirtualDocument = virtualDocument;
		const newVirtualDocument = new VirtualDocument.Entity(
			currentVirtualDocument.id,
			currentVirtualDocument.name,
			currentVirtualDocument.description,
			currentVirtualDocument.createdAt,
			DateTime.now(),
		);
		setVirtualDocument(newVirtualDocument);

		onUploaded();
	};

	let storedDocumentEntries: React.ReactNode[] | React.ReactNode = null;
	if (storedDocuments) {
		storedDocumentEntries = storedDocuments.map((storedDocument, index) => (
			<a
				key={storedDocument.id}
				href={getStoredDocumentDownloadUrl(storedDocument.id)}
				target="_blank"
				className="bg-gray-300 hover:bg-gray-400 border-gray-800"
			>
				<StoredDocumentListItem entry={storedDocument} index={index + 1} />
			</a>
		));
	} else {
		// Could replace with a skeleton loader.
		storedDocumentEntries = <p>Loading...</p>;
	}

	return (
		<div className="bg-gray-200 rounded-md flex">
			<div className="flex-col min-w-96 max-w-96">
				<div className="flex-col mx-6 my-4">
					<h2 className="text-2xl font-bold">{virtualDocument.name}</h2>
				</div>

				<div className="h-0.5 bg-gray-300 my-1"></div>

				<div className="flex-col mx-7 my-3">
					<p>{virtualDocument.description ?? "No description"}</p>
					<div className="mt-1"></div>
					<p className="text-gray-600 text-sm">Created at: {virtualDocument.createdAt.toLocaleString(DateTime.DATETIME_MED)}</p>
					<p className="text-gray-600 text-sm">Last updated at: {virtualDocument.updatedAt.toLocaleString(DateTime.DATETIME_MED)}</p>
				</div>

				<div className="flex-col mx-5">
					<div className="flex flex-col border-2 divide-y-2 divide-gray-400 border-gray-400 rounded-md mt-5 min-h-56 max-h-96 overflow-y-auto">
						{storedDocumentEntries}
					</div>
				</div>

				<div className="flex-col mx-5 my-5">
					<FilePickerComponent onUpload={onUpload} />
				</div>
			</div>
		</div>
	);
}

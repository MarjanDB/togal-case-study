import { DateTime } from "luxon";
import { StoredDocumentEntry } from "../../../../_shared/entities/StoredDocumentEntry";

export default function StoredDocumentListItem(params: { entry: StoredDocumentEntry.Entity; index: number }) {
	const { entry, index } = params;

	return (
		<div className="flex flex-row justify-between">
			<p className="ml-2 mt-1 text-sm">{index}.</p>
			<div className="flex flex-col items-end mr-2 my-1">
				<p className="text-xs text-gray-600">{entry.storedAt.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}</p>
				<p className="overflow-clip truncate max-w-full">{entry.originalFileName}</p>
			</div>
		</div>
	);
}

import { useEffect, useReducer, useRef } from "react";

const enum FilePickerMode {
	NotPicked = "notPicked",
	PickedNotUploaded = "pickedNotUploaded",
	Uploading = "uploading",
}

// Handling failed upload would also be a good next step
const enum FilePickerAction {
	Picked = "picked",
	DismissedPickedFile = "dismissedPickedFile",
	Upload = "upload",
	Uploaded = "uploaded",
}

type FilePickerState = {
	mode: FilePickerMode;
	file: File | null;
};

function filePickerReducer(state: FilePickerState, action: { type: FilePickerAction; file: File | null }): FilePickerState {
	const stateActionsAvailable: Record<FilePickerMode, Partial<Record<FilePickerAction, () => FilePickerState>>> = {
		[FilePickerMode.NotPicked]: {
			[FilePickerAction.Picked]: () => {
				return { mode: FilePickerMode.PickedNotUploaded, file: action.file };
			},
		},
		[FilePickerMode.PickedNotUploaded]: {
			[FilePickerAction.DismissedPickedFile]: () => {
				return { mode: FilePickerMode.NotPicked, file: null };
			},
			[FilePickerAction.Upload]: () => {
				return { mode: FilePickerMode.Uploading, file: action.file };
			},
		},
		[FilePickerMode.Uploading]: {
			[FilePickerAction.Uploaded]: () => {
				return { mode: FilePickerMode.NotPicked, file: null };
			},
		},
	};

	const stateAction = stateActionsAvailable[state.mode]?.[action.type];

	if (!stateAction) {
		return state;
	}

	return { ...state, ...stateAction() };
}

export type FilePickerProps = {
	onUpload: (file: File, onUploaded: () => void) => Promise<void>;
};

export default function FilePickerComponent({ onUpload }: FilePickerProps) {
	const [state, dispatch] = useReducer(filePickerReducer, { mode: FilePickerMode.NotPicked, file: null });
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		// Not sure if this is the correct way to do this.
		if (state.mode === FilePickerMode.Uploading) {
			// Not sure if there's any type safe way of doing this (the file! assertion).
			onUpload(state.file!, () => dispatch({ type: FilePickerAction.Uploaded, file: null }));
		}
	}, [state.mode]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const fileObj = event.target.files && event.target.files[0];
		if (!fileObj) {
			return;
		}

		dispatch({ type: FilePickerAction.Picked, file: fileObj });
		event.target.value = "";
	};

	const displayForNotPicked = (
		<button onClick={() => inputRef.current?.click()} className="bg-blue-400 rounded-md w-full py-2 text-white">
			Upload Additional Document
		</button>
	);
	const displayForPickedNotUploaded = (
		<div className="flex flex-row w-full justify-between">
			<div className="flex flex-row">
				<button
					className="bg-red-400 rounded-md px-4 text-white shrink-0"
					onClick={() => dispatch({ type: FilePickerAction.DismissedPickedFile, file: null })}
				>
					X
				</button>
				<p className="text-gray-600 text-sm my-auto mx-2 truncate">{state.file?.name}</p>
			</div>
			<button
				className="bg-blue-400 rounded-md px-4 py-2 text-white flex-auto shrink-0"
				onClick={() => dispatch({ type: FilePickerAction.Upload, file: state.file })}
			>
				Upload
			</button>
		</div>
	);
	const displayForUploading = <button className="bg-blue-400 rounded-md w-full py-2 text-white">Uploading...</button>;

	const displayLookup: Record<FilePickerMode, React.ReactNode> = {
		[FilePickerMode.NotPicked]: displayForNotPicked,
		[FilePickerMode.PickedNotUploaded]: displayForPickedNotUploaded,
		[FilePickerMode.Uploading]: displayForUploading,
	};

	return (
		<div className="rounded-md flex">
			<input type="file" className="hidden" ref={inputRef} onChange={handleFileChange} />
			{displayLookup[state.mode]}
		</div>
	);
}

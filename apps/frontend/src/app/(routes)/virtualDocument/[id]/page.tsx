import VirtualDocumentComponent from "./_components/VirtualDocument";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	return (
		<div className="bg-gray-200 rounded-md flex items-center">
			<VirtualDocumentComponent id={id} />
		</div>
	);
}

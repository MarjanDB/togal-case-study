import { LuxonTimeProvider } from "@backend/Providers/TimeProvider/Providers/LuxonTimeProvider";
import { UUID7Provider } from "@backend/Providers/UniqueIdentifierProvider/Providers/UUID7Provider";
import { sleep } from "@backend/Utils/Helpers";

describe(UUID7Provider.name, () => {
	it("Has sortable identifiers", async () => {
		const provider = new UUID7Provider(new LuxonTimeProvider());

		const first = provider.getUniqueIdentifier();

		await sleep(100);

		const second = provider.getUniqueIdentifier();

		expect([second, first].sort()).toEqual([first, second]);
	});
});

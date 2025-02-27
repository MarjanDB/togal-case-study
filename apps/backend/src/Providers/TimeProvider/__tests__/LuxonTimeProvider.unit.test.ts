import { LuxonTimeProvider } from "Providers/TimeProvider/Providers/LuxonTimeProvider";
import { sleep } from "Utils/Helpers";

describe(LuxonTimeProvider.name, () => {
	it("Time flows", async () => {
		const provider = new LuxonTimeProvider();

		const first = provider.getTime();

		await sleep(100);

		const second = provider.getTime();

		expect([second, first].sort()).toEqual([first, second]);
	});
});

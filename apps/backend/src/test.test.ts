import typia from "typia";

describe("Typia test", () => {
	it("should work without transformation", () => {
		expect(typia.assert<{ id: number }>({ id: 123 })).toEqual({ id: 123 });
	});
});

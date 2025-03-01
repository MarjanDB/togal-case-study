export default {
	displayName: "backend",
	globals: {},
	testEnvironment: "node",
	transform: {
		"^.+\\.ts$": [
			"ts-jest",
			{
				tsconfig: "<rootDir>/tsconfig.spec.json",
			},
		],
	},
	moduleFileExtensions: ["ts", "js"],
	coverageDirectory: "coverage",
	preset: "../../jest.preset.js",
};

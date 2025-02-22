import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import path from "path";
import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
	"apps/*",
	{
		plugins: [nxViteTsPaths()],
		resolve: {
			alias: {
				"@backend/*": path.resolve(__dirname, "./apps/backend/src/*"),
			},
		},
		test: {
			globals: true,
		},
	},
	"library/*",
	{
		plugins: [nxViteTsPaths()],
		test: {
			globals: true,
		},
	},
]);

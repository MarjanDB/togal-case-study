/// <reference types='vitest' />
import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	root: __dirname,
	cacheDir: "node_modules/.vite/apps/contracts",
	plugins: [
		//nxViteTsPaths({ debug: true }),
		nxCopyAssetsPlugin(["*.md"]),
		tsconfigPaths({ root: __dirname }),
		dts({ entryRoot: path.join(__dirname, "src"), tsconfigPath: "tsconfig.lib.json" }),
	],
	// Uncomment this if you are using workers.
	// worker: {
	//  plugins: [ nxViteTsPaths() ],
	// },
	// Configuration for building your library.
	// See: https://vitejs.dev/guide/build.html#library-mode
	build: {
		lib: {
			entry: "./src/index.ts",
			name: "contracts",
			fileName: (format) => `contracts.${format}.js`,
		},
		outDir: "dist",
		emptyOutDir: true,
		reportCompressedSize: true,
		commonjsOptions: {
			transformMixedEsModules: true,
		},
	},
	test: {
		watch: false,
		globals: true,
		environment: "node",
		include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		reporters: ["default"],
		coverage: {
			reportsDirectory: "coverage",
			provider: "v8",
		},
	},
});

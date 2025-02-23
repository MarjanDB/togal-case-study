import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin";
import UnpluginTypia from "@ryoppippi/unplugin-typia/vite";
import { VitePluginNode } from "vite-plugin-node";
import { defineConfig } from "vitest/config";

import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	root: __dirname,
	cacheDir: "../../node_modules/.vite/apps/backend",
	server: {
		port: 4200,
		host: "localhost",
	},
	preview: {
		port: 4300,
		host: "localhost",
	},
	plugins: [
		//nxViteTsPaths(), // broken
		viteTsConfigPaths(),
		nxCopyAssetsPlugin(["*.md"]),
		VitePluginNode({
			// Nodejs native Request adapter
			// currently this plugin support 'express', 'nest', 'koa' and 'fastify' out of box,
			// you can also pass a function if you are using other frameworks, see Custom Adapter section
			adapter: "nest",

			// tell the plugin where is your project entry
			appPath: "./src/main.ts",

			// Optional, default: 'viteNodeApp'
			// the name of named export of you app from the appPath file
			exportName: "viteNodeApp",

			// Optional, default: false
			// if you want to init your app on boot, set this to true
			initAppOnBoot: false,

			// Optional, default: 'esbuild'
			// The TypeScript compiler you want to use
			// by default this plugin is using vite default ts compiler which is esbuild
			// 'swc' compiler is supported to use as well for frameworks
			// like Nestjs (esbuild dont support 'emitDecoratorMetadata' yet)
			// you need to INSTALL `@swc/core` as dev dependency if you want to use swc
			tsCompiler: "esbuild",

			// swc configs, see [swc doc](https://swc.rs/docs/configuration/swcrc)
			swcOptions: {},
		}),
		UnpluginTypia(),
	],
	// Uncomment this if you are using workers.
	// worker: {
	//  plugins: [ nxViteTsPaths() ],
	// },
	build: {
		outDir: "../../dist/apps/backend",
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
		reporters: ["basic"],
		disableConsoleIntercept: true,
		coverage: {
			reportsDirectory: "../../coverage/apps/backend",
			provider: "v8",
		},
	},
});

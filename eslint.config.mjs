// @ts-check

import eslint from "@eslint/js";
import nxPlugin from "@nx/eslint-plugin";
import prettierConfig from "eslint-config-prettier";
import { flatConfigs as importPlugin } from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

export default [
	eslint.configs.recommended,
	importPlugin.recommended,
	...tseslint.configs.recommended,
	...nxPlugin.configs["flat/typescript"],
	{
		settings: {
			"import/resolver": {
				typescript: {
					project: ["tsconfig.json", "tsconfig.app.json", "tsconfig.lib.json", "tsconfig.base.json"],
				},
			},
		},
		languageOptions: {
			parser: tseslint.parser,
			globals: {
				node: true,
				vitest: true,
			},
			parserOptions: {
				projectService: true,
				project: "tsconfig.json",
				tsconfigRootDir: ".",
				sourceType: "module",
				allowDefaultProject: true,
			},
		},
		plugins: {
			tseslint: tseslint.plugin,
		},
		rules: {
			"@typescript-eslint/interface-name-prefix": "off",
			"@typescript-eslint/explicit-function-return-type": "error",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-namespace": "off",
			"@typescript-eslint/no-unused-vars": ["off", { argsIgnorePattern: "^_" }],
			"import/no-cycle": "error",
		},
	},
	prettier,
	prettierConfig,
	{
		ignores: ["eslint.config.mjs", "**/dist/**", "dist/**", "out-tsc/**"],
	},
	{
		files: ["vitest.workspace.ts", "jest.config.ts", "vite.config.ts"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: null,
				projectService: false,
			},
		},
	},
];

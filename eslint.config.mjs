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
				project: "tsconfig.json",
				tsconfigRootDir: ".",
				sourceType: "module",
			},
		},
		plugins: {
			tseslint: tseslint.plugin,
		},
		ignores: ["eslint.config.mjs"],
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
];

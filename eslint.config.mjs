// @ts-check

import eslint from "@eslint/js";
import nxPlugin from "@nx/eslint-plugin";
import prettierConfig from "eslint-config-prettier";
import prettier from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

export default [
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...nxPlugin.configs["flat/typescript"],
	{
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: "tsconfig.json",
				tsconfigRootDir: ".",
				sourceType: "module",
			},
			globals: {
				node: true,
				jest: true,
			},
		},
		plugins: {
			tseslint: tseslint.plugin,
		},
		ignores: ["eslint.config.mjs"],
		rules: {
			"@typescript-eslint/interface-name-prefix": "off",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-namespace": "off",
			"@nx/enforce-module-boundaries": "error",
			"@nx/dependency-checks": "error",
		},
	},
	prettier,
	prettierConfig,
];

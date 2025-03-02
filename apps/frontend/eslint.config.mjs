import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import nx from "@nx/eslint-plugin";
import { dirname } from "path";
import { fileURLToPath } from "url";
import baseConfig from "../../eslint.config.mjs";
const compat = new FlatCompat({
	baseDirectory: dirname(fileURLToPath(import.meta.url)),
	recommendedConfig: js.configs.recommended,
});

const removeDuplicateImportPlugin = (config) => {
	for (const singleConfig of config) {
		if (singleConfig?.plugins?.["import"]) {
			console.log("eslint.config.js: Stripped import plugin");
			delete singleConfig.plugins["import"];
		}
	}
	return config;
};

export default [
	...fixupConfigRules(compat.extends("next")),
	...fixupConfigRules(compat.extends("next/core-web-vitals")),
	...removeDuplicateImportPlugin(baseConfig),
	...removeDuplicateImportPlugin(nx.configs["flat/react-typescript"]), // https://github.com/nrwl/nx/issues/28871
	{
		ignores: [".next/**/*"],
	},
];

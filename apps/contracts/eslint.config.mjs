import path from "path";
import { fileURLToPath } from "url";
import baseConfig from "../../eslint.config.mjs";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
	...baseConfig,
	{
		languageOptions: {
			parserOptions: {
				tsconfigRootDir: dirname,
			},
		},
	},
];

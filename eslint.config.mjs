import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

import jestPlugin from "eslint-plugin-jest";
import fsdImport from "./lib/index.js";
import nodePlugin from "eslint-plugin-n";
import eslintPlugin from "eslint-plugin-eslint-plugin";

export default tseslint.config(
  { ignores: ["./git", "./vscode", "dist", "node_modules", "README.md"] },
  {
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      jestPlugin.configs["flat/recommended"],
      nodePlugin.configs["flat/recommended"],
      eslintPlugin.configs["flat/recommended"],
      ...fsdImport.configs.recommended,
    ],
    files: ["**/*.{ts,tsx}", "**/*.test.js"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
    },
    rules: {
      "n/no-missing-import": "off",
    },
  }
);

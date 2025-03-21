import fs from "fs";
const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

import relativePath from "./rules/relative-path.js";
import layerImports from "./rules/layer-imports.js";
import publicApiImports from "./rules/public-api-imports.js";
import { ESLint, Linter } from "eslint";

const fsdImport: ESLint.Plugin & {
  configs: {
    recommended: Linter.Config<Linter.RulesRecord>;
  };
} = {
  meta: {
    name: pkg.name as string,
    version: pkg.version as string,
  },
  configs: { recommended: {} },
  rules: {
    "relative-path": relativePath,
    "layer-imports": layerImports,
    "public-api-imports": publicApiImports,
  },
  processors: {},
};

// assign configs here so we can reference `plugin`
Object.assign(fsdImport.configs, {
  recommended: [
    {
      plugins: {
        "@fsd-import": fsdImport,
      },
      rules: {
        "@fsd-import/relative-path": "error",
        "@fsd-import/layer-imports": "error",
        "@fsd-import/public-api": "error",
      },
      languageOptions: {
        globals: {
          myGlobal: "readonly",
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
  ],
});

// for ESM
export default fsdImport;

import { Linter, RuleTester } from "eslint";
import { ContextProps } from "src/types/index.js";

export enum ImportError {
  LAYER_IMPORT_ERROR = "LAYER_IMPORT_ERROR",
  RELATIVE_PATH_ERROR = "RELATIVE_PATH_ERROR",
  PUBLIC_ERROR = "PUBLIC_ERROR",
  TESTING_PUBLIC_ERROR = "TESTING_PUBLIC_ERROR",
}

export enum AliasOptions {
  ALIAS = "alias",
  PATTERNS = "testFilesPatterns",
  IGNORE = "ignoreImportPatterns",
}

const TestConfig: Linter.Config<Linter.RulesRecord> = {
  languageOptions: {
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
};

export const ruleTester = new RuleTester(TestConfig);

export const aliasOptions: ContextProps = {
  [AliasOptions.ALIAS]: "@",
  [AliasOptions.PATTERNS]: ["**/*.test.ts", "**/*.test.ts", "**/StoreDecorator.tsx"],
  [AliasOptions.IGNORE]: ["**/StoreProvider"],
};

export const Layers: { [key: string]: string } = {
  app: "app",
  pages: "pages",
  widgets: "widgets",
  features: "features",
  entities: "entities",
  shared: "shared",
};

export const { app: _, shared: __, ...CheckingLayers } = Layers;

export const { app: ___, ...RelativeLayers } = Layers;

const LayerArray = Object.keys(Layers);

export const AvailableLayers = Object.fromEntries(
  LayerArray.map((layer, index) => [layer, LayerArray.filter((_, idx) => (idx < 4 ? idx > index : idx >= index))])
);

export const ErrorMessages: Record<ImportError, string> = {
  [ImportError.LAYER_IMPORT_ERROR]: "Current layer can import only layers below: ",
  [ImportError.RELATIVE_PATH_ERROR]: "Within one slice all paths should be related.",
  [ImportError.PUBLIC_ERROR]: "Absolute import is allowed only from public API (index.ts).",
  [ImportError.TESTING_PUBLIC_ERROR]: "Test data should be imported from public API (testing.ts).",
};

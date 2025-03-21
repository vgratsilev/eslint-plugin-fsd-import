import { Rule } from "eslint";
import { getCurrentFileLayer, isPathRelative } from "../helpers/index.js";
import micromatch from "micromatch";
import { ContextProps } from "../types/index.js";
import { AvailableLayers, ErrorMessages, ImportError, Layers } from "../configs/index.js";

/**
 * @fileoverview Restrict imports only from layers below
 * @author rweapon
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const layerImports: Rule.RuleModule = {
  meta: {
    type: "problem",
    messages: ErrorMessages,
    docs: {
      description: "Restrict imports from higher layer into layer below.",
      recommended: true,
      url: "https://github.com/rweapon/eslint-plugin-fsd-import-v9/blob/main/docs/rules/layer-imports.md",
    },
    fixable: undefined,
    schema: [
      {
        type: "object",
        properties: {
          alias: {
            type: "string",
          },
          ignoreImportPatterns: {
            type: "array",
          },
        },
      },
    ],
  },
  create(context) {
    const { alias = "", ignoreImportPatterns = [] }: ContextProps = context.options[0] ?? {};

    const getImportLayer = (value: string) => {
      const importPath = value.replace(`${alias}/`, "");
      const segments = importPath?.split("/");

      return segments?.[0];
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value as string;
        const fromFileName = context.filename;
        const currentFileLayer = getCurrentFileLayer(fromFileName);
        const importLayer = getImportLayer(importPath);

        if (isPathRelative(importPath)) {
          return;
        }

        if (!Layers[importLayer] || !Layers[currentFileLayer]) {
          return;
        }

        const isIgnored = ignoreImportPatterns.some((pattern) => {
          return micromatch.isMatch(importPath, pattern);
        });

        if (isIgnored) {
          return;
        }

        if (!AvailableLayers[currentFileLayer]?.includes(importLayer)) {
          context.report({
            node,
            messageId: `${ErrorMessages[ImportError.LAYER_IMPORT_ERROR]} (${AvailableLayers[currentFileLayer]?.join(
              ", "
            )}).`,
          });
        }
      },
    };
  },
};

export default layerImports;

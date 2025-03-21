import path from "path";
import { Rule } from "eslint";
import micromatch from "micromatch";
import { isPathRelative, normalizePath } from "../helpers/index.js";
import { CheckingLayers, ErrorMessages, ImportError } from "../configs/index.js";
import { ContextProps } from "../types/index.js";

/**
 * @fileoverview Restrict imports only from public API
 * @author rweapon
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const publicApiImports: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Restrict imports only from public API",
      recommended: true,
      url: "https://github.com/rweapon/eslint-plugin-fsd-import-v9/blob/main/docs/rules/public-api-imports.md",
    },
    fixable: "code",
    messages: ErrorMessages,
    schema: [
      {
        type: "object",
        properties: {
          alias: {
            type: "string",
          },
          testFilesPatterns: {
            type: "array",
          },
        },
      },
    ],
  },
  create(context) {
    const { alias = "", testFilesPatterns = [] }: ContextProps = context.options[0] ?? {};

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportDeclaration(node) {
        // example: src/entities/Article
        const value = node.source.value as string;
        const newAlias = value.includes("@") ? `${alias}/` : "";
        const importTo = value.replace(newAlias, "");

        if (isPathRelative(importTo)) {
          return;
        }

        // [entities, article, model, types]
        const segments = importTo.split("/");
        const layer = segments[0];
        const slice = segments[1];

        if (!CheckingLayers[layer]) {
          return;
        }

        const isImportNotFromPublicApi = segments.length > 2;

        // [entities, article, testing]
        const isTestingPublicApi = segments[2] === "testing" && segments.length < 4;
        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report({
            node,
            messageId: ErrorMessages[ImportError.PUBLIC_ERROR],
            fix: (fixer) => {
              return fixer.replaceText(node.source, `'${newAlias}${layer}/${slice}'`);
            },
          });
        }

        if (isTestingPublicApi) {
          // example: C:\Users\Vadim\Documents\Github\react-blog\src\entities\Article
          const currentFilePath = context.filename;
          const normalizedPath = normalizePath(currentFilePath, path);

          const isCurrentFileTesting = testFilesPatterns?.some((pattern) =>
            micromatch.isMatch(normalizedPath, pattern)
          );

          if (!isCurrentFileTesting) {
            context.report({ node, messageId: ErrorMessages[ImportError.TESTING_PUBLIC_ERROR] });
          }
        }
      },
    };
  },
};

export default publicApiImports;

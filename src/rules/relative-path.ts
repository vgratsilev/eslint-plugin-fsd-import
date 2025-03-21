import path from "path";
import { Rule } from "eslint";
import { isPathRelative, normalizePath } from "../helpers/index.js";
import { ErrorMessages, RelativeLayers } from "../configs/index.js";
import { ContextProps } from "../types/index.js";

/**
 * @fileoverview Restrict only relative path imports within single slice
 * @author rweapon
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const relativePath: Rule.RuleModule = {
  meta: {
    type: "problem",
    messages: ErrorMessages,
    docs: {
      description: "feature sliced relative path checker",
      recommended: true,
      url: "https://github.com/rweapon/eslint-plugin-fsd-import-v9/blob/main/docs/rules/relative-path.md",
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          alias: {
            type: "string",
          },
        },
      },
    ],
  },
  create(context) {
    const { alias }: ContextProps = context.options[0] || {};

    function shouldBeRelative(from: string, to: string) {
      if (isPathRelative(to)) {
        return false;
      }

      // example: entities/Article
      const toArray: string[] = to.split("/");
      const toLayer = toArray[0]; // entities
      const toSlice = toArray[1]; // Article

      if (!toLayer || !toSlice || !RelativeLayers[toLayer]) {
        return false;
      }

      // example: c:\Users\user\project\src\entities\Article
      const projectFrom = normalizePath(from, path);

      const fromArray = projectFrom.split("/");

      const fromLayer = fromArray[1];
      const fromSlice = fromArray[2];

      if (!fromLayer || !fromSlice || !RelativeLayers[fromLayer]) {
        return false;
      }

      return fromSlice === toSlice && toLayer === fromLayer;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportDeclaration(node) {
        try {
          // example: src/entities/Article
          const value = node.source.value as string;
          const importFrom = alias ? value.replace(`${alias}/`, "") : value; // entities/Article/model/slice/addCommentFormSlice

          // example: C:\\project\\src\\entities\\Article\\index.ts
          const fromFileName = context.filename;

          if (shouldBeRelative(fromFileName, importFrom)) {
            context.report({
              node,
              messageId: "Within one slice all paths should be related.",
              fix: (fixer) => {
                const projectFrom = normalizePath(fromFileName, path); // /entities/Article/index.ts
                const newPath = projectFrom.split("/").slice(0, -1).join("/"); // '/entities/Article'

                let relativePath = path.relative(newPath, `/${importFrom}`).replace(/\\/g, "/");

                if (!relativePath.startsWith(".")) {
                  relativePath = "./" + relativePath;
                }

                return fixer.replaceText(node.source, `'${relativePath}'`);
              },
            });
          }
        } catch (e) {
          console.log(e);
        }
      },
    };
  },
};

export default relativePath;

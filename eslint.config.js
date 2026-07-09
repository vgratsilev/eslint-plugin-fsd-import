"use strict";

const js = require("@eslint/js");
const globals = require("globals");
const eslintPluginModule = require("eslint-plugin-eslint-plugin");
const eslintPlugin = eslintPluginModule.default || eslintPluginModule;
const nodePlugin = addContextCompatibility(require("eslint-plugin-node"));

function addContextCompatibility(plugin) {
  return {
    ...plugin,
    rules: Object.fromEntries(
      Object.entries(plugin.rules).map(([name, rule]) => [
        name,
        {
          ...rule,
          create(context) {
            let currentNode = context.sourceCode.ast;
            const compatContext = new Proxy(context, {
              get(target, property) {
                if (property === "getFilename") {
                  return () => target.filename;
                }

                if (property === "getPhysicalFilename") {
                  return () => target.physicalFilename || target.filename;
                }

                if (property === "getSourceCode") {
                  return () => target.sourceCode;
                }

                if (property === "getScope") {
                  return () => target.sourceCode.getScope(currentNode);
                }

                return target[property];
              },
            });
            const listeners = rule.create(compatContext);

            return Object.fromEntries(
              Object.entries(listeners).map(([selector, listener]) => [
                selector,
                wrapListener(listener),
              ]),
            );

            function wrapListener(listener) {
              if (typeof listener === "function") {
                return function wrappedListener(node) {
                  const previousNode = currentNode;
                  currentNode = node;

                  try {
                    return listener.apply(this, arguments);
                  } finally {
                    currentNode = previousNode;
                  }
                };
              }

              return {
                ...listener,
                enter: listener.enter && wrapListener(listener.enter),
                exit: listener.exit && wrapListener(listener.exit),
              };
            }
          },
        },
      ]),
    ),
  };
}

module.exports = [
  {
    ignores: ["node_modules/**"],
  },
  js.configs.recommended,
  {
    plugins: {
      node: nodePlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: globals.node,
    },
    rules: nodePlugin.configs.recommended.rules,
  },
  eslintPlugin.configs.recommended,
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: globals.mocha,
    },
  },
  {
    files: ["eslint.config.js"],
    rules: {
      "node/no-unpublished-require": "off",
    },
  },
];

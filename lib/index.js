/**
 * @fileoverview plugin for check path in fsd project
 * @author vgratsilev
 */
'use strict';

const rules = {
    'forbidden-app-imports': require('./rules/forbidden-app-imports'),
    'fsd-relative-path': require('./rules/fsd-relative-path'),
    'layer-imports': require('./rules/layer-imports'),
    'no-cross-slice-relative-imports': require('./rules/no-cross-slice-relative-imports'),
    'no-deprecated-layer-names': require('./rules/no-deprecated-layer-names'),
    'public-api-imports': require('./rules/public-api-imports'),
    'shared-public-api-imports': require('./rules/shared-public-api-imports'),
    'slice-boundaries': require('./rules/slice-boundaries'),
};

const recommendedRules = Object.fromEntries(
    Object.keys(rules)
        .filter((ruleName) => ruleName !== 'public-api-imports')
        .map((ruleName) => [`fsd-import/${ruleName}`, 'error']),
);

const plugin = { rules };

plugin.configs = {
    recommended: {
        plugins: ['fsd-import'],
        rules: recommendedRules,
    },
    'flat/recommended': {
        plugins: { 'fsd-import': plugin },
        rules: recommendedRules,
    },
};

module.exports = plugin;

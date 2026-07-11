/**
 * @fileoverview plugin for check path in fsd project
 * @author vgratsilev
 */
'use strict';

module.exports = {
    rules: {
        'forbidden-app-imports': require('./rules/forbidden-app-imports'),
        'fsd-relative-path': require('./rules/fsd-relative-path'),
        'layer-imports': require('./rules/layer-imports'),
        'no-cross-slice-relative-imports': require('./rules/no-cross-slice-relative-imports'),
        'no-deprecated-layer-names': require('./rules/no-deprecated-layer-names'),
        'public-api-imports': require('./rules/public-api-imports'),
        'shared-public-api-imports': require('./rules/shared-public-api-imports'),
        'slice-boundaries': require('./rules/slice-boundaries'),
    },
};

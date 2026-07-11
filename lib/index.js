/**
 * @fileoverview plugin for check path in fsd project
 * @author vgratsilev
 */
'use strict';

module.exports = {
    rules: {
        'fsd-relative-path': require('./rules/fsd-relative-path'),
        'layer-imports': require('./rules/layer-imports'),
        'no-cross-slice-relative-imports': require('./rules/no-cross-slice-relative-imports'),
        'public-api-imports': require('./rules/public-api-imports'),
    },
};

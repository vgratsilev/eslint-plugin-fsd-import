/**
 * @fileoverview feature sliced relative path checker
 * @author vgratsilev
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/fsd-relative-path"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("fsd-relative-path", rule, {
  valid: [
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: "eee",
      errors: [{ message: "Fill me in.", type: "Me too" }],
    },
  ],
});

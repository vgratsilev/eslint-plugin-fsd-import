/**
 * @fileoverview Restrict only relative path imports within single slice
 * @author rweapon
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from "../relative-path.js";
import { aliasOptions, ErrorMessages, ImportError, ruleTester } from "../../configs/index.js";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
console.log("Starting relative-path test");

ruleTester.run("relative-path", rule, {
  valid: [
    {
      filename: "C:\\project\\src\\entities\\Article",
      code: "import { addCommentFormReducer, addCommentFormActions } from '../../model/slice/addCommentFormSlice';",
    },
  ],

  invalid: [
    {
      filename: "C:\\project\\src\\entities\\Article\\index.ts",
      code: "import { addCommentFormReducer, addCommentFormActions } from 'entities/Article/model/slice/addCommentFormSlice';",
      errors: [ErrorMessages[ImportError.RELATIVE_PATH_ERROR]],
      output: "import { addCommentFormReducer, addCommentFormActions } from './model/slice/addCommentFormSlice';",
    },
    {
      filename: "C:\\project\\src\\entities\\Article\\index.ts",
      code: "import { addCommentFormReducer, addCommentFormActions } from '@/entities/Article/model/slice/addCommentFormSlice';",
      errors: [ErrorMessages[ImportError.RELATIVE_PATH_ERROR]],
      options: [aliasOptions],
      output: "import { addCommentFormReducer, addCommentFormActions } from './model/slice/addCommentFormSlice';",
    },
    {
      filename: "C:\\project\\src\\entities\\Article\\ui\\ArticlePage\\ArticlePage.tsx",
      code: "import { addCommentFormReducer, addCommentFormActions } from 'entities/Article/model/slice/addCommentFormSlice';",
      errors: [ErrorMessages[ImportError.RELATIVE_PATH_ERROR]],
      output: "import { addCommentFormReducer, addCommentFormActions } from '../../model/slice/addCommentFormSlice';",
    },
  ],
});

console.log("Relative-path test completed.");

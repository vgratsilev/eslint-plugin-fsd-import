/**
 * @fileoverview Restrict imports only from public API
 * @author rweapon
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from "../public-api-imports.js";
import { ruleTester, ErrorMessages, ImportError, aliasOptions } from "../../configs/index.js";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
console.log("Starting public-api-imports test");

ruleTester.run("public-api-imports", rule, {
  valid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slice/addCommentFormSlice';",
    },
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article';",
      options: [aliasOptions],
    },
    {
      filename: "C:\\project\\src\\entities\\Article\\file.test.ts",
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/testing'",
      options: [aliasOptions],
    },
    {
      filename: "C:\\project\\src\\entities\\Article\\StoreDecorator.tsx",
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/testing'",
      options: [aliasOptions],
    },
    {
      filename: "C:\\project\\src\\entities\\Article\\file.test.ts",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      options: [aliasOptions],
    },
    {
      filename: "C:\\project\\src\\entities\\Article\\StoreDecorator.tsx",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      options: [aliasOptions],
    },
  ],

  invalid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/slice/addCommentFormSlice.ts';",
      errors: [ErrorMessages[ImportError.PUBLIC_ERROR]],
      output: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article';",
    },
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/slice/addCommentFormSlice.ts';",
      errors: [ErrorMessages[ImportError.PUBLIC_ERROR]],
      options: [aliasOptions],
      output: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article';",
    },
    {
      filename: "C:\\project\\src\\entities\\Article\\StoreDecorator.tsx",
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/testing/file.tsx';",
      errors: [ErrorMessages[ImportError.PUBLIC_ERROR]],
      options: [aliasOptions],
      output: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article';",
    },
    {
      filename: "C:\\project\\src\\entities\\Article\\StoreDecorator.tsx",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing/file.tsx';",
      errors: [ErrorMessages[ImportError.PUBLIC_ERROR]],
      options: [aliasOptions],
      output: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article';",
    },
    {
      filename: "C:\\project\\src\\entities\\Article\\forbidden.ts",
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/testing';",
      errors: [ErrorMessages[ImportError.TESTING_PUBLIC_ERROR]],
      options: [aliasOptions],
    },
    {
      filename: "C:\\project\\src\\entities\\Article\\forbidden.ts",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing';",
      errors: [ErrorMessages[ImportError.TESTING_PUBLIC_ERROR]],
      options: [aliasOptions],
    },
  ],
});

console.log("Public-api-imports test completed.");

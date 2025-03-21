/**
 * @fileoverview Restrict imports only from layers below
 * @author rweapon
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from "../layer-imports.js";
import { ruleTester, aliasOptions } from "../../configs/index.js";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
console.log("Starting layer-imports test");

ruleTester.run("layer-imports", rule, {
  valid: [
    {
      filename: "C:\\project\\src\\features\\Article\\file.test.ts",
      code: "import { addCommentFormActions, addCommentFormReducer } from 'shared/Button/Button.tsx';",
    },
    {
      filename: "C:\\project\\src\\features\\Article\\file.test.ts",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/shared/Button/Button.tsx';",
      options: [aliasOptions],
    },
    {
      filename: "C:\\project\\src\\features\\Article\\file.test.ts",
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Button/Button.tsx';",
    },
    {
      filename: "C:\\project\\src\\features\\Article\\file.test.ts",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Button/Button.tsx';",

      options: [aliasOptions],
    },
    {
      filename: "C:\\project\\src\\entities\\Article\\file.test.ts",
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Button/Button.tsx';",
    },
    {
      filename: "C:\\project\\src\\app\\Article\\file.test.ts",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Button/Button.tsx';",

      options: [aliasOptions],
    },
    {
      filename: "C:\\project\\src\\widgets\\Article\\file.test.ts",
      code: "import { useLocation } from 'react-router-dom';",

      options: [aliasOptions],
    },
    {
      filename: "C:\\project\\src\\index.tsx",
      code: "import { useLocation } from '@/app/test.ts';",

      options: [aliasOptions],
    },
    {
      filename: "C:\\project\\src\\entities\\Article.tsx",
      code: "import { StateSchema } from '@/app/providers/StoreProvider';",

      options: [aliasOptions],
    },
  ],

  invalid: [
    {
      filename: "C:\\project\\src\\entities\\Article\\file.test.ts",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/features/Button.tsx';",
      errors: 1,
      options: [aliasOptions],
    },
    {
      filename: "C:\\project\\src\\features\\Article\\file.test.ts",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Button.tsx';",
      errors: 1,
      options: [aliasOptions],
    },
    {
      filename: "C:\\project\\src\\widgets\\Article\\file.test.ts",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/pages/Main.tsx';",
      errors: 1,
      options: [aliasOptions],
    },
  ],
});

console.log("Layer-imports test completed.");

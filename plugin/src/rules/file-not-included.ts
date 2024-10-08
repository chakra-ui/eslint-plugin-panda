import { type Rule, createRule } from '../utils'
import { isPandaImport, isValidFile } from '../utils/helpers'
import { TSESTree } from '@typescript-eslint/utils'

export const RULE_NAME = 'file-not-included'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description:
        'Disallow the use of Panda CSS in files that are not included in the specified Panda CSS `include` config.',
    },
    messages: {
      include:
        'The use of Panda CSS is not allowed in this file. Please ensure the file is included in the Panda CSS `include` configuration.',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // Determine if the current file is included in the Panda CSS configuration
    const isFileIncluded = isValidFile(context)

    // If the file is included, no need to proceed
    if (isFileIncluded) {
      return {}
    }

    let hasReported = false

    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (hasReported) return

        if (!isPandaImport(node, context)) return

        // Report only on the first import declaration
        context.report({
          node,
          messageId: 'include',
        })

        hasReported = true
      },
    }
  },
})

export default rule

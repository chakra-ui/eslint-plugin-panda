import { isIdentifier, isVariableDeclaration } from '../utils/nodes'
import { type Rule, createRule } from '../utils'
import { getAncestor, getImportSpecifiers, isValidFile } from '../utils/helpers'

export const RULE_NAME = 'no-config-function-in-source'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Prohibit the use of config functions outside the Panda config.',
    },
    messages: {
      configFunction: 'Unnecessary`{{name}}` call. \nConfig functions should only be used in panda config.',
      delete: 'Delete `{{name}}` call.',
    },
    type: 'suggestion',
    hasSuggestions: true,
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (!isValidFile(context)) return
        if (!isIdentifier(node.callee)) return
        if (!CONFIG_FUNCTIONS.includes(node.callee.name)) return

        context.report({
          node,
          messageId: 'configFunction',
          data: {
            name: node.callee.name,
          },
          suggest: [
            {
              messageId: 'delete',
              data: {
                name: node.callee.name,
              },
              fix(fixer) {
                const declaration = getAncestor(isVariableDeclaration, node)
                const importSpec = getImportSpecifiers(context).find(
                  (s) => isIdentifier(node.callee) && s.specifier.local.name === node.callee.name,
                )
                return [
                  fixer.remove(declaration ?? node),
                  importSpec?.specifier ? fixer.remove(importSpec?.specifier) : ({} as any),
                ]
              },
            },
          ],
        })
      },
    }
  },
})

export default rule

const CONFIG_FUNCTIONS = [
  'defineConfig',
  'defineRecipe',
  'defineSlotRecipe',
  'defineParts',
  'definePattern',
  'definePreset',
  'defineKeyframes',
  'defineGlobalStyles',
  'defineUtility',
  'defineTextStyles',
  'defineLayerStyles',
  'defineStyles',
  'defineTokens',
  'defineSemanticTokens',
]

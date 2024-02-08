import fileNotIncluded, { RULE_NAME as FileNotIncluded } from './file-not-included'
import noConfigunctionInSource, { RULE_NAME as NoConfigunctionInSource } from './no-config-function-in-source'
import noDebug, { RULE_NAME as NoDebug } from './no-debug'
import noDynamicStyling, { RULE_NAME as NoDynamicStyling } from './no-dynamic-styling'
import noEscapeHatch, { RULE_NAME as NoEscapeHatch } from './no-escape-hatch'
import noHardCodedColor, { RULE_NAME as NoHardCodedColor } from './no-hardcoded-color'
import noInvalidTokenPaths, { RULE_NAME as NoInvalidTokenPaths } from './no-invalid-token-paths'
import noPropertyRenaming, { RULE_NAME as NoPropertyRenaming } from './no-property-renaming'
import preferLonghandProperties, { RULE_NAME as PreferLonghandProperties } from './prefer-longhand-properties'
import preferShorthandProperties, { RULE_NAME as PreferShorthandProperties } from './prefer-shorthand-properties'
import noUnsafeTokenUsage, { RULE_NAME as NoUnsafeTokenUsage } from './no-unsafe-token-fn-usage'
import preferAtomicProperties, { RULE_NAME as PreferAtomicProperties } from './prefer-atomic-properties'

export const rules = {
  [FileNotIncluded]: fileNotIncluded,
  [NoConfigunctionInSource]: noConfigunctionInSource,
  [NoDebug]: noDebug,
  [NoDynamicStyling]: noDynamicStyling,
  [NoEscapeHatch]: noEscapeHatch,
  [NoHardCodedColor]: noHardCodedColor,
  [NoInvalidTokenPaths]: noInvalidTokenPaths,
  [NoPropertyRenaming]: noPropertyRenaming,
  [PreferLonghandProperties]: preferLonghandProperties,
  [PreferShorthandProperties]: preferShorthandProperties,
  [NoUnsafeTokenUsage]: noUnsafeTokenUsage,
  [PreferAtomicProperties]: preferAtomicProperties,
} as any

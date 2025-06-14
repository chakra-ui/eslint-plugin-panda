import fileNotIncluded, { RULE_NAME as FileNotIncluded } from './file-not-included'
import noConfigunctionInSource, { RULE_NAME as NoConfigunctionInSource } from './no-config-function-in-source'
import noDebug, { RULE_NAME as NoDebug } from './no-debug'
import noDeprecatedTokens, { RULE_NAME as NoDeprecatedTokens } from './no-deprecated-tokens'
import noDynamicStyling, { RULE_NAME as NoDynamicStyling } from './no-dynamic-styling'
import noEscapeHatch, { RULE_NAME as NoEscapeHatch } from './no-escape-hatch'
import noHardCodedColor, { RULE_NAME as NoHardCodedColor } from './no-hardcoded-color'
import noImportant, { RULE_NAME as NoImportant } from './no-important'
import noInvalidNesting, { RULE_NAME as NoInvalidNesting } from './no-invalid-nesting'
import noInvalidTokenPaths, { RULE_NAME as NoInvalidTokenPaths } from './no-invalid-token-paths'
import noMarginProperties, { RULE_NAME as NoMarginProperties } from './no-margin-properties'
import noPhysicalProperties, { RULE_NAME as NoPhysicalProperties } from './no-physical-properties'
import noPropertyRenaming, { RULE_NAME as NoPropertyRenaming } from './no-property-renaming'
import noUnsafeTokenUsage, { RULE_NAME as NoUnsafeTokenUsage } from './no-unsafe-token-fn-usage'
import preferLonghandProperties, { RULE_NAME as PreferLonghandProperties } from './prefer-longhand-properties'
import preferShorthandProperties, { RULE_NAME as PreferShorthandProperties } from './prefer-shorthand-properties'
import preferAtomicProperties, { RULE_NAME as PreferAtomicProperties } from './prefer-atomic-properties'
import preferCompositeProperties, { RULE_NAME as PreferCompositeProperties } from './prefer-composite-properties'
import preferUnifiedPropertyStyle, { RULE_NAME as PreferUnifiedPropertyStyle } from './prefer-unified-property-style'

export const rules = {
  [FileNotIncluded]: fileNotIncluded,
  [NoConfigunctionInSource]: noConfigunctionInSource,
  [NoDebug]: noDebug,
  [NoDeprecatedTokens]: noDeprecatedTokens,
  [NoDynamicStyling]: noDynamicStyling,
  [NoEscapeHatch]: noEscapeHatch,
  [NoHardCodedColor]: noHardCodedColor,
  [NoImportant]: noImportant,
  [NoInvalidTokenPaths]: noInvalidTokenPaths,
  [NoInvalidNesting]: noInvalidNesting,
  [NoMarginProperties]: noMarginProperties,
  [NoPhysicalProperties]: noPhysicalProperties,
  [NoPropertyRenaming]: noPropertyRenaming,
  [NoUnsafeTokenUsage]: noUnsafeTokenUsage,
  [PreferLonghandProperties]: preferLonghandProperties,
  [PreferShorthandProperties]: preferShorthandProperties,
  [PreferAtomicProperties]: preferAtomicProperties,
  [PreferCompositeProperties]: preferCompositeProperties,
  [PreferUnifiedPropertyStyle]: preferUnifiedPropertyStyle,
} as any

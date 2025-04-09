export const physicalProperties: Record<string, string> = {
  borderBottom: 'borderBlockEnd',
  borderBottomColor: 'borderBlockEndColor',
  borderBottomStyle: 'borderBlockEndStyle',
  borderBottomWidth: 'borderBlockEndWidth',
  borderTop: 'borderBlockStart',
  borderTopColor: 'borderBlockStartColor',
  borderTopStyle: 'borderBlockStartStyle',
  borderTopWidth: 'borderBlockStartWidth',
  borderRight: 'borderInlineEnd',
  borderRightColor: 'borderInlineEndColor',
  borderRightStyle: 'borderInlineEndStyle',
  borderRightWidth: 'borderInlineEndWidth',
  borderLeft: 'borderInlineStart',
  borderLeftColor: 'borderInlineStartColor',
  borderLeftStyle: 'borderInlineStartStyle',
  borderLeftWidth: 'borderInlineStartWidth',
  borderTopLeftRadius: 'borderStartStartRadius',
  borderBottomLeftRadius: 'borderEndStartRadius',
  borderTopRightRadius: 'borderStartEndRadius',
  borderBottomRightRadius: 'borderEndEndRadius',
  marginBottom: 'marginBlockEnd',
  marginTop: 'marginBlockStart',
  marginRight: 'marginInlineEnd',
  marginLeft: 'marginInlineStart',
  paddingBottom: 'paddingBlockEnd',
  paddingTop: 'paddingBlockStart',
  paddingRight: 'paddingInlineEnd',
  paddingLeft: 'paddingInlineStart',
  left: 'insetInlineStart',
  right: 'insetInlineEnd',
  top: 'insetBlockStart',
  bottom: 'insetBlockEnd',
}

// Map of property names to their physical values and corresponding logical values
export const physicalPropertyValues: Record<string, Record<string, string>> = {
  // text-align physical values mapped to logical values
  textAlign: {
    left: 'start',
    right: 'end',
  },
}

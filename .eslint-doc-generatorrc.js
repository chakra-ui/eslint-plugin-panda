/** @type {import('eslint-doc-generator').GenerateOptions} */
module.exports = {
  // Config format (flat config style)
  configFormat: 'name',

  // Rule list columns
  ruleListColumns: ['name', 'description', 'configsError', 'configsWarn', 'fixable', 'hasSuggestions', 'options'],

  // Ignore configs for table (we only have recommended and all)
  ignoreConfig: ['all'],

  // Path configuration
  pathRuleDoc: 'docs/rules/{name}.md',
  pathRuleList: ['README.md'],

  // Rule doc configuration
  ruleDocTitleFormat: 'name',
  ruleDocSectionInclude: ['Rule Details'],

  // URL for rule docs (for links in README)
  urlRuleDoc: 'docs/rules/{name}.md',
}

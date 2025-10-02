---
"@pandacss/eslint-plugin": patch
---

Allow CSS variables in no-hardcoded-color rule. CSS variables like `var(--something-here)` are now recognized as valid color values and will not trigger the no-hardcoded-color rule error.

---
"@pandacss/eslint-plugin": patch
---

Fixed errant console.error statement in filterInvalidTokens that was logging regardless of whether invalid tokens were found. Now only logs when invalid tokens are actually detected.

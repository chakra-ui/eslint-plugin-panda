---
'@pandacss/eslint-plugin': patch
---

Memoize `syncAction` worker round-trips. Rules query the panda context once per visited AST node through a synchronous
worker round-trip, but the worker already caches one context per config path for the lifetime of the process, so those
answers cannot change between calls. Caching them removes the repeated round-trips without changing any diagnostic.
`isValidFile` is keyed on the current file instead, since the worker reads it from `opts` rather than from the
arguments.

import { type analyze } from '@typescript-eslint/scope-manager'
import { type ImportResult } from '.'

// Cache for data which is expensive to compute and can be reused while linting a file.
// This data is shared across multiple rules.
// Cache is cleared after linting each file (see `ruleFinished` below).
export const cache: {
  // Cached imports for the current file
  imports: ImportResult[] | null
  // Cached scope analysis for the current file
  scopeAnalysis: ReturnType<typeof analyze> | null
} = {
  imports: null,
  scopeAnalysis: null,
}

// Tracks how many rules are currently running for the current file.
//
// Each rule increments this counter in `create()` and decrements it in `Program:exit`.
// When counter reaches 0, all rules have finished for the file, and cache is cleared.
// See `createRule` in `utils/index.ts` which injects `ruleStarted()` and `ruleFinished()` calls
// into each rule automatically.
//
// As a safety net, a microtask is also queued to reset the caches.
// This handles the case where a rule throws an error during linting, preventing `Program:exit` from firing
// and leaving the counter stuck at a non-zero value.
//
// This scenario doesn't matter in ESLint CLI, because if an error is thrown during linting, the process exits.
// But in language server, it does matter - language server catches the error and the process continues.
// It also matters in tests. You don't want an error thrown in one test to affect the next test.
// The `queueMicrotask` covers both these eventualities - it ensures the cache is reset before the next lint run.
let numRulesRunning = 0

let resetMicrotaskScheduled = false

export function ruleStarted() {
  numRulesRunning++
  if (!resetMicrotaskScheduled) {
    queueMicrotask(resetCacheMicrotask)
    resetMicrotaskScheduled = true
  }
}

export function ruleFinished() {
  numRulesRunning--
  if (numRulesRunning === 0) {
    resetCache()
  }
}

function resetCache() {
  cache.imports = null
  cache.scopeAnalysis = null
}

function resetCacheMicrotask() {
  resetCache()
  numRulesRunning = 0
  resetMicrotaskScheduled = false
}

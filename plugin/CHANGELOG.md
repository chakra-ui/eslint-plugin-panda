# @pandacss/eslint-plugin

## 0.3.0

### Minor Changes

- 4ad93d1: Improve performance

## 0.2.14

### Patch Changes

- 376fd83: Allow CSS variables in no-hardcoded-color rule. CSS variables like `var(--something-here)` are now recognized
  as valid color values and will not trigger the no-hardcoded-color rule error.

## 0.2.13

### Patch Changes

- 65efe6e: Fix dist/index check to support all build output formats (ESM and CJS)

## 0.2.12

### Patch Changes

- 4005b4c: Fix global configPath

## 0.2.11

### Patch Changes

- 7c7a7bd: Add `no-deprecated-tokens` rule

## 0.2.9

### Patch Changes

- 1f2fce3: detect textAlign physical values like "left"/"right"

## 0.2.8

### Patch Changes

- 5aa9600: Bump @pandacss/\* packages to v0.53.2

## 0.2.7

### Patch Changes

- 2f64f0b: Fix security

## 0.2.6

### Patch Changes

- 13b2312: Fix peer deps issue

## 0.2.5

### Patch Changes

- 7876614: Upgrade dependencies

## 0.2.4

### Patch Changes

- 8c928df: Add whitelist option to rules

## 0.2.3

### Patch Changes

- aed180b: Fix false positive in no-unsafe-token-usage rule

## 0.2.2

### Patch Changes

- ea9b523: Fix token extraction

## 0.2.1

### Patch Changes

- 9b43b55: Warn when sourceCode is not detected

## 0.2.0

### Minor Changes

- 121ad0f: Use memoization in rules

## 0.1.15

### Patch Changes

- d33a582: Fix array syntax in `no-dynamic-styling`

## 0.1.14

### Patch Changes

- 73492df: Fix false positive in array syntax

## 0.1.13

### Patch Changes

- b004285: Ignore non panda files

## 0.1.12

### Patch Changes

- 7dbd78e: Fix array syntax in `no-dynamic-styling`

## 0.1.11

### Patch Changes

- ac21839: Let `no-dynamic-styling` rule, report dynamic properties.

## 0.1.10

### Patch Changes

- 4914e3d: Fix false positives in recipe variants

## 0.1.9

### Patch Changes

- 15a4f9c: Fix scope manager

## 0.1.8

### Patch Changes

- 979d8c9: Fix false positive in @pandacss/no-invalid-nesting

## 0.1.7

### Patch Changes

- 4e6f95d: Try catch syncs

## 0.1.6

### Patch Changes

- 3551e7d: Fix messagePort error

## 0.1.5

### Patch Changes

- 0a065fe: Fix empty imports

## 0.1.4

### Patch Changes

- e3d07b6: Fix tokens resolving

## 0.1.3

### Patch Changes

- 8107e4f: Improve performance

## 0.1.2

### Patch Changes

- 86d8aab: Ignore `no-unsafe-token-fn-usage` rule in css variables

## 0.1.1

### Patch Changes

- 28b3dfc: Fix checking non styled props in panda dotted components. i.e. `<styled.xxx />`

## 0.1.0

### Minor Changes

- 8be6eef: First Minor Release

## 0.0.20

### Patch Changes

- 2a61cf6: Add `no-hardcoded-color` rule to recommended config

## 0.0.19

### Patch Changes

- 22cc4ac: Add `noOpacity` option to `no-hardcoded-color` rule

## 0.0.18

### Patch Changes

- 36414a9: Allow color opacity in `no-hardcoded-color` rule

## 0.0.17

### Patch Changes

- db8ac8e: Update recommended config

## 0.0.16

### Patch Changes

- 6c2004d: Add `no-margin-properties` rule

## 0.0.15

### Patch Changes

- 7ecd6ad: Improve nested styling detection in `no-invalid-nesting` rule
- b8cfeec: Add `no-physical-properties` rule

## 0.0.14

### Patch Changes

- 782889b: Normalize paths

## 0.0.13

### Patch Changes

- 587b69a: Add `no-invalid-nesting` rule

## 0.0.12

### Patch Changes

- 54f309e: Add `prefer-unified-property-style` rule
- 9e43308: Add `no-important` rule

## 0.0.11

### Patch Changes

- 084f07b: Add `prefer-composite-properties` rule

## 0.0.10

### Patch Changes

- 5c3577d: Add `prefer-shorthand-properties` rule

## 0.0.9

### Patch Changes

- 3aaba9f: - Rename `no-shorthand-prop` rule to `prefer-longhand-properties`

## 0.0.8

### Patch Changes

- ec81fec: Fix conditions being parsed as dynamic styles

## 0.0.7

### Patch Changes

- ed5d9de: Detect pattern properties

## 0.0.6

### Patch Changes

- c84bf9e: Switch from auto fixable to suggestions.

## 0.0.5

### Patch Changes

- b9d37ff: Fix linting on non panda attributes

## 0.0.4

### Patch Changes

- 3f722a1: Baseline release 🎉

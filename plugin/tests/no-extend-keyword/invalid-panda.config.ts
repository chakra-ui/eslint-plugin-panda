// This config has presets, yet the 'extend' keyword is not used, we want to warn the user about this, because the internal preset will be overridden.

import { defineConfig, definePreset } from '@pandacss/dev'

export default defineConfig({
  presets: [
    definePreset({
      theme: {
        tokens: {
          colors: {
            rose: {
              50: { value: '#fff1f2' },
            },
          },
        },
      },
    }),
  ],

  theme: {},
  conditions: {},
  patterns: {},
})

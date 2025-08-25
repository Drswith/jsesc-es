import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    platform: 'neutral',
    dts: true,
    target: ['node6', 'chrome27', 'firefox3', 'safari4', 'opera10'],
  },
])

import { defineConfig } from 'tsdown'
import pkg from './package.json'

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    platform: 'node',
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    target: ['node6', 'chrome27', 'firefox3', 'safari4', 'opera10'],
    env: {
      __VERSION__: pkg.version,
    },
    outputOptions: {
      exports: 'named',
    },
  },
])

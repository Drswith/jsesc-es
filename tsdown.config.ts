import fsp from 'node:fs/promises'
import { defineConfig } from 'tsdown'

export default defineConfig(async () => {
  const pkg = JSON.parse(await fsp.readFile('./package.json', 'utf-8'))

  return [
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
  ]
})

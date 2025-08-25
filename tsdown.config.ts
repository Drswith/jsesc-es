import type { UserConfig } from 'tsdown'
import fsp from 'node:fs/promises'
import { defineConfig } from 'tsdown'

export default defineConfig(async () => {
  const pkg = JSON.parse(await fsp.readFile('./package.json', 'utf-8'))

  const config: UserConfig = {
    entry: ['./src/index.ts'],
    platform: 'neutral',
    target: ['node6', 'chrome27', 'firefox3', 'safari4', 'opera10'],
    env: {
      __VERSION__: pkg.version,
    },
    outputOptions: {
      exports: 'named',
    },
  }

  return [
    {
      ...config,
      format: ['esm'],
      dts: true,
    },
    {
      ...config,
      format: ['cjs'],
      dts: false,
    },
  ]
})

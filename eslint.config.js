// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/tests/**',
      'DIFFERENCES.md',
      'MIGRATION.md',
    ],
  },
  {
    rules: {
      'no-control-regex': 'off',
      'regexp/no-escape-backspace': 'off',
    },
  },
)

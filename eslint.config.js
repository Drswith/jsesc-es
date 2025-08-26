// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    ignores: [
      '**/dist/**',
      '**/bin/**',
      '**/original-jsesc/**',
      '**/node_modules/**',
      '**/tests/**',
      'DIFFERENCES.md',
      'MIGRATION.md',
      'README.md',
    ],
  },
  {
    rules: {
      'no-control-regex': 'off',
      'regexp/no-escape-backspace': 'off',
    },
  },
)

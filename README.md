# jsesc-es

[![npm version](https://img.shields.io/npm/v/jsesc-es.svg)](https://www.npmjs.com/package/jsesc-es)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![ES Modules](https://img.shields.io/badge/ES-Modules-brightgreen.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A modern TypeScript + ESM refactor of the popular [jsesc](https://github.com/mathiasbynens/jsesc) library with 100% API compatibility

Given some data, _jsesc-es_ returns a stringified representation of that data. jsesc-es is similar to `JSON.stringify()` except:

1. it outputs JavaScript instead of JSON [by default](#json), enabling support for data structures like ES6 maps and sets;
2. it offers [many options](#api) to customize the output;
3. its output is ASCII-safe [by default](#minimal), thanks to its use of [escape sequences](https://mathiasbynens.be/notes/javascript-escapes) where needed;
4. **NEW**: Full TypeScript support with comprehensive type definitions;
5. **NEW**: Native ES Modules with tree-shaking support;
6. **NEW**: Modern development toolchain and improved performance.

For any input, jsesc-es generates the shortest possible valid printable-ASCII-only output. [Here's an online demo.](https://mothereff.in/js-escapes)

jsesc-es's output can be used instead of `JSON.stringify`'s to avoid [mojibake](https://en.wikipedia.org/wiki/Mojibake) and other encoding issues, or even to [avoid errors](https://twitter.com/annevk/status/380000829643571200) when passing JSON-formatted data (which may contain U+2028 LINE SEPARATOR, U+2029 PARAGRAPH SEPARATOR, or [lone surrogates](https://esdiscuss.org/topic/code-points-vs-unicode-scalar-values#content-14)) to a JavaScript parser or an UTF-8 encoder.

## ✨ What's New in jsesc-es

### 🔥 TypeScript First
- **Built-in type definitions** - No need for `@types/jsesc`
- **Full type safety** with comprehensive `JsescOptions` interface
- **Better IDE support** with IntelliSense and auto-completion
- **Type-safe option validation** at compile time

### 📦 Modern Module System
- **Native ES Modules** with tree-shaking support
- **Multiple import styles** - default, named, or mixed imports
- **CommonJS compatibility** for legacy projects
- **Optimized bundle size** with modern build tools

### ⚡ Enhanced Performance
- **Improved function handling** with better type detection
- **Optimized escape logic** for common use cases
- **Modern JavaScript features** for better performance
- **Reduced bundle overhead** compared to the original

### 🛠️ Developer Experience
- **Modern toolchain** with Vitest, tsdown, and pnpm
- **Better error messages** with TypeScript integration
- **Comprehensive test coverage** with type checking
- **Active maintenance** with regular updates

## Installation

```bash
# pnpm (recommended) - https://pnpm.io/ 
pnpm add jsesc-es

# yarn - https://yarnpkg.com/
yarn add jsesc-es

# npm - https://www.npmjs.com/
npm install jsesc-es
```

## Usage

### ES Modules (Recommended)

```typescript
// Default import (most common)
import jsesc from 'jsesc-es'

// Named import
import { jsesc } from 'jsesc-es'

// Import with types (TypeScript)
import jsesc, { type JsescOptions } from 'jsesc-es'

// Import version info
import { version } from 'jsesc-es'

// Mixed import (not recommended)
import jsesc, { version, type JsescOptions } from 'jsesc-es'
```

### TypeScript Usage

```typescript
import jsesc, { type JsescOptions } from 'jsesc-es'

// Type-safe options
const options: JsescOptions = {
  quotes: 'single',
  wrap: true,
  es6: true,
  minimal: false
}

// Type-safe function usage
function escapeForHTML(input: string): string {
  return jsesc(input, {
    quotes: 'double',
    wrap: true,
    isScriptContext: true
  })
}

// Type-safe configuration objects
const configs = {
  json: { json: true } as JsescOptions,
  minimal: { minimal: true } as JsescOptions,
  es6: { es6: true, quotes: 'backtick' } as JsescOptions
}
```

### CommonJS (Legacy Support)

```javascript
// CommonJS require (still supported)
const jsesc = require('jsesc-es')

// Dynamic import (modern alternative)
const { jsesc } = await import('jsesc-es')
```

### Node.js ESM

Ensure your `package.json` includes:

```json
{
  "type": "module"
}
```

Or use `.mjs` file extension:

```javascript
// app.mjs
import jsesc from 'jsesc-es'
```

## API

### `jsesc(value, options?)`

This function takes a value and returns an escaped version of the value where any characters that are not printable ASCII symbols are escaped using the shortest possible (but valid) [escape sequences for use in JavaScript strings](https://mathiasbynens.be/notes/javascript-escapes). The first supported value type is strings:

```js
jsesc('Ich ♥ Bücher')
// → 'Ich \\u2665 B\\xFCcher'

jsesc('foo 𝌆 bar')
// → 'foo \\uD834\\uDF06 bar'
```

Instead of a string, the `value` can also be an array, an object, a map, a set, a number, a BigInt, or a buffer. In such cases, `jsesc` returns a stringified version of the value where any characters that are not printable ASCII symbols are escaped in the same way.

```js
// Escaping an array
jsesc([
  'Ich ♥ Bücher',
  'foo 𝌆 bar'
])
// → '[\'Ich \\u2665 B\\xFCcher\',\'foo \\uD834\\uDF06 bar\']'

// Escaping an object
jsesc({
  'Ich ♥ Bücher': 'foo 𝌆 bar'
})
// → '{\'Ich \\u2665 B\\xFCcher\':\'foo \\uD834\\uDF06 bar\'}'
```

### Options

The optional `options` argument accepts an object with the following options. In TypeScript, use the `JsescOptions` type for full type safety:

```typescript
import { type JsescOptions } from 'jsesc-es'

const options: JsescOptions = {
  // Your options here with full IntelliSense support
}
```

#### `quotes`

The default value for the `quotes` option is `'single'`. This means that any occurrences of `'` in the input string are escaped as `\'`, so that the output can be used in a string literal wrapped in single quotes.

```js
jsesc('`Lorem` ipsum "dolor" sit \'amet\' etc.')
// → 'Lorem ipsum "dolor" sit \\\'amet\\\' etc.'

jsesc('`Lorem` ipsum "dolor" sit \'amet\' etc.', {
  quotes: 'single'
})
// → '`Lorem` ipsum "dolor" sit \\\'amet\\\' etc.'
```

If you want to use the output as part of a string literal wrapped in double quotes, set the `quotes` option to `'double'`.

```js
jsesc('`Lorem` ipsum "dolor" sit \'amet\' etc.', {
  quotes: 'double'
})
// → '`Lorem` ipsum \\"dolor\\" sit \'amet\' etc.'
```

If you want to use the output as part of a template literal (i.e. wrapped in backticks), set the `quotes` option to `'backtick'`.

```js
jsesc('`Lorem` ipsum "dolor" sit \'amet\' etc.', {
  quotes: 'backtick'
})
// → '\\`Lorem\\` ipsum "dolor" sit \'amet\' etc.'
```

#### `numbers`

The default value for the `numbers` option is `'decimal'`. This means that any numeric values are represented using decimal integer literals. Other valid options are `binary`, `octal`, and `hexadecimal`.

```js
jsesc(42, { numbers: 'binary' })
// → '0b101010'

jsesc(42, { numbers: 'octal' })
// → '0o52'

jsesc(42, { numbers: 'decimal' })
// → '42'

jsesc(42, { numbers: 'hexadecimal' })
// → '0x2A'
```

#### `wrap`

The `wrap` option takes a boolean value (`true` or `false`), and defaults to `false` (disabled). When enabled, the output is a valid JavaScript string literal wrapped in quotes.

```js
jsesc('Lorem ipsum "dolor" sit \'amet\' etc.', {
  quotes: 'single',
  wrap: true
})
// → '\'Lorem ipsum "dolor" sit \\\'amet\\\' etc.\''

jsesc('Lorem ipsum "dolor" sit \'amet\' etc.', {
  quotes: 'double',
  wrap: true
})
// → '"Lorem ipsum \\"dolor\\" sit \'amet\' etc."'
```

#### `es6`

The `es6` option takes a boolean value (`true` or `false`), and defaults to `false` (disabled). When enabled, any astral Unicode symbols in the input are escaped using [ECMAScript 6 Unicode code point escape sequences](https://mathiasbynens.be/notes/javascript-escapes#unicode-code-point).

```js
// By default, the `es6` option is disabled:
jsesc('foo 𝌆 bar 💩 baz')
// → 'foo \\uD834\\uDF06 bar \\uD83D\\uDCA9 baz'

// To enable it:
jsesc('foo 𝌆 bar 💩 baz', {
  es6: true
})
// → 'foo \\u{1D306} bar \\u{1F4A9} baz'
```

#### `escapeEverything`

The `escapeEverything` option takes a boolean value (`true` or `false`), and defaults to `false` (disabled). When enabled, all the symbols in the output are escaped — even printable ASCII symbols.

```js
jsesc('lolwat"foo\'bar', {
  escapeEverything: true
})
// → '\\x6C\\x6F\\x6C\\x77\\x61\\x74\\"\\x66\\x6F\\x6F\\\'\\x62\\x61\\x72'
```

#### `minimal`

The `minimal` option takes a boolean value (`true` or `false`), and defaults to `false` (disabled). When enabled, only a limited set of symbols in the output are escaped.

**Note:** with this option enabled, jsesc-es output is no longer guaranteed to be ASCII-safe.

```js
jsesc('foo\u2029bar\nbaz©qux𝌆flops', {
  minimal: true
})
// → 'foo\\u2029bar\\nbaz©qux𝌆flops'
```

#### `isScriptContext`

The `isScriptContext` option takes a boolean value (`true` or `false`), and defaults to `false` (disabled). When enabled, occurrences of [`</script` and `</style`](https://mathiasbynens.be/notes/etago) in the output are escaped.

```js
jsesc('foo</script>bar', {
  isScriptContext: true
})
// → 'foo<\\/script>bar'
```

#### `compact`

The `compact` option takes a boolean value (`true` or `false`), and defaults to `true` (enabled). When enabled, the output for arrays and objects is as compact as possible.

```js
jsesc({ 'Ich ♥ Bücher': 'foo 𝌆 bar' }, {
  compact: true // this is the default
})
// → '{\'Ich \u2665 B\xFCcher\':\'foo \uD834\uDF06 bar\'}'

jsesc({ 'Ich ♥ Bücher': 'foo 𝌆 bar' }, {
  compact: false
})
// → '{\n\t\'Ich \u2665 B\xFCcher\': \'foo \uD834\uDF06 bar\'\n}'
```

#### `indent`

The `indent` option takes a string value, and defaults to `'\t'`. When the `compact` setting is disabled (`false`), the value of the `indent` option is used to format the output.

```js
jsesc({ 'Ich ♥ Bücher': 'foo 𝌆 bar' }, {
  compact: false,
  indent: '  '
})
// → '{\n  \'Ich \u2665 B\xFCcher\': \'foo \uD834\uDF06 bar\'\n}'
```

#### `indentLevel`

The `indentLevel` option takes a numeric value, and defaults to `0`. It represents the current indentation level.

```js
jsesc(['a', 'b', 'c'], {
  compact: false,
  indentLevel: 1
})
// → '[\n\t\t\'a\',\n\t\t\'b\',\n\t\t\'c\'\n\t]'
```

#### `json`

The `json` option takes a boolean value (`true` or `false`), and defaults to `false` (disabled). When enabled, the output is valid JSON.

```js
jsesc('foo\x00bar\xFF\uFFFDbaz', {
  json: true
})
// → '"foo\\u0000bar\\u00FF\\uFFFDbaz"'

jsesc({ 'foo\x00bar\xFF\uFFFDbaz': 'foo\x00bar\xFF\uFFFDbaz' }, {
  json: true
})
// → '{"foo\\u0000bar\\u00FF\\uFFFDbaz":"foo\\u0000bar\\u00FF\\uFFFDbaz"}'
```

#### `lowercaseHex`

The `lowercaseHex` option takes a boolean value (`true` or `false`), and defaults to `false` (disabled). When enabled, any alphabetical hexadecimal digits in escape sequences are in lowercase.

```js
jsesc('Ich ♥ Bücher', {
  lowercaseHex: true
})
// → 'Ich \\u2665 B\\xfccher'
//                    ^^

jsesc(42, {
  numbers: 'hexadecimal',
  lowercaseHex: true
})
// → '0x2a'
//      ^^
```

### Version Information

```typescript
// Access version information
import jsesc, { version } from 'jsesc-es'

console.log(jsesc.version) // e.g., "0.0.3"
console.log(version)       // e.g., "0.0.3"
```

## Migration from jsesc

Migrating from the original `jsesc` library is straightforward:

### 1. Update Dependencies

```bash
# Remove old package
npm uninstall jsesc

# Install new package
npm install jsesc-es
```

### 2. Update Imports

```javascript
// Before (CommonJS)
const jsesc = require('jsesc')

// After (ES Modules)
import jsesc from 'jsesc-es'

// Or with types (TypeScript)
import jsesc, { type JsescOptions } from 'jsesc-es'
```

### 3. Enjoy Enhanced Features

- **Full TypeScript support** with no additional setup
- **Better IDE experience** with IntelliSense
- **Modern module system** with tree-shaking
- **100% API compatibility** - no code changes needed

For detailed migration instructions, see [MIGRATION.md](./MIGRATION.md).

## TypeScript Examples

### Creating Utility Functions

```typescript
import jsesc, { type JsescOptions } from 'jsesc-es'

// Create type-safe utility functions
const createEscaper = (defaultOptions: JsescOptions) => {
  return (input: string, options?: Partial<JsescOptions>): string => {
    return jsesc(input, { ...defaultOptions, ...options })
  }
}

// Pre-configured escapers
const escapeForHTML = createEscaper({
  quotes: 'double',
  wrap: true,
  isScriptContext: true
})

const escapeForJSON = createEscaper({
  json: true
})

const escapeMinimal = createEscaper({
  minimal: true
})

// Usage with full type safety
const htmlSafe = escapeForHTML('Hello "World"')
const jsonSafe = escapeForJSON({ message: 'Hello 世界' })
const minimalEscape = escapeMinimal('Simple text')
```

### Advanced Configuration

```typescript
import { type JsescOptions } from 'jsesc-es'

// Define configuration presets
const PRESETS: Record<string, JsescOptions> = {
  html: {
    quotes: 'double',
    wrap: true,
    isScriptContext: true,
    escapeEverything: false
  },
  json: {
    json: true,
    compact: true
  },
  es6: {
    es6: true,
    quotes: 'backtick',
    wrap: true
  },
  debug: {
    escapeEverything: true,
    compact: false,
    indent: '  '
  }
} as const

// Type-safe preset usage
function escapeWithPreset(
  input: any,
  preset: keyof typeof PRESETS,
  overrides?: Partial<JsescOptions>
): string {
  const config = { ...PRESETS[preset], ...overrides }
  return jsesc(input, config)
}
```

## Performance

jsesc-es includes several performance improvements over the original:

- **Optimized type checking** for better runtime performance
- **Improved function handling** with enhanced detection logic
- **Modern JavaScript features** for better engine optimization
- **Reduced overhead** in common escape scenarios
- **Tree-shaking support** for smaller bundle sizes

## Browser Support

jsesc-es provides broad compatibility through its dual build system:

### Runtime Requirements

**For ES Modules (recommended):**
- **Node.js**: 14+ (native ESM support)
- **Browsers**: Chrome 61+, Firefox 60+, Safari 10.1+, Edge 16+
- **ES Modules**: Native support required

**For CommonJS (legacy):**
- **Node.js**: 6+ (transpiled output)
- **Browsers**: Chrome 27+, Firefox 3+, Safari 4+, Opera 10+ (with bundler)

### Build Targets vs. Module System

While jsesc-es maintains compatibility with legacy environments through its transpiled CommonJS build (targeting node6, chrome27, etc.), **ES Modules require modern environments** that support the `import`/`export` syntax natively. The build targets ensure the *JavaScript syntax and APIs* work in older environments, but the *module system itself* has minimum version requirements.

**Key Points:**
- 📦 **CommonJS build**: Works in very old environments (Node 6+, Chrome 27+)
- 🚀 **ESM build**: Requires modern environments with native ESM support
- 🔧 **Legacy projects**: Use CommonJS or transpile ESM with Babel/TypeScript
- ⚡ **Modern projects**: Use ESM for better tree-shaking and performance

### TypeScript Support
- **TypeScript**: 4.5+
- **Built-in types**: No `@types/` package needed

## Development

```bash
# Clone the repository
git clone https://github.com/your-username/jsesc-es.git
cd jsesc-es

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the project
pnpm build

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **[Mathias Bynens](https://github.com/mathiasbynens)** - Creator of the original [jsesc](https://github.com/mathiasbynens/jsesc) library
- **The TypeScript team** - For excellent tooling and type system
- **The open source community** - For continuous feedback and contributions

---

**jsesc-es** - A modern, TypeScript-first approach to JavaScript string escaping. 🚀

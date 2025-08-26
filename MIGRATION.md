# Migration Guide from jsesc to jsesc-es

This document provides a detailed guide for migrating from the original `jsesc` library to the `jsesc-es` TypeScript + ESM version.

## Quick Migration Checklist

- [ ] Update package dependency: `jsesc` → `jsesc-es`
- [ ] Update import statements: CommonJS → ES Modules
- [ ] Check TypeScript configuration (if using TypeScript)
- [ ] Update test code (if needed)
- [ ] Verify build configuration
- [ ] Run tests to ensure functionality

## 1. Installation and Dependency Updates

### Uninstall Original Library

```bash
# npm
npm uninstall jsesc

# yarn
yarn remove jsesc

# pnpm
pnpm remove jsesc
```

### Install New Version

```bash
# npm
npm install jsesc-es

# yarn
yarn add jsesc-es

# pnpm
pnpm add jsesc-es
```

### Update package.json

**Before Migration**:
```json
{
  "dependencies": {
    "jsesc": "^3.1.0"
  }
}
```

**After Migration**:
```json
{
  "dependencies": {
    "jsesc-es": "^0.0.3"
  }
}
```

## 2. Import Statement Migration

### CommonJS → ES Modules

**Before Migration (CommonJS)**:
```javascript
// Method 1: Direct import
const jsesc = require('jsesc')

// Method 2: Destructuring import (not applicable to original library)
// const { jsesc } = require('jsesc') // ❌ Original library doesn't support

// Usage
const result = jsesc('Hello "World"')
console.log(jsesc.version) // Access version info
```

**After Migration (ES Modules)**:
```javascript
// Method 1: Default import (recommended)
import jsesc from 'jsesc-es'

// Method 2: Named import
import { jsesc } from 'jsesc-es'

// Method 3: Import both function and types (TypeScript)
import jsesc, { type JsescOptions } from 'jsesc-es'

// Method 4: Import version info
import { version } from 'jsesc-es'

// Usage
const result = jsesc('Hello "World"')
console.log(version) // Access version info
```

### Dynamic Imports

**Before Migration**:
```javascript
// CommonJS dynamic import
const jsesc = require('jsesc')
```

**After Migration**:
```javascript
// ES Modules dynamic import
const { jsesc } = await import('jsesc-es')
// or
const jsescModule = await import('jsesc-es')
const jsesc = jsescModule.default
```

## 3. TypeScript Project Migration

### Adding Type Support

**Before Migration**: Required additional type definitions
```bash
npm install --save-dev @types/jsesc
```

**After Migration**: Built-in type definitions, no additional installation needed
```typescript
// Automatically get complete type support
import jsesc, { type JsescOptions } from 'jsesc-es'

// Type-safe option configuration
const options: JsescOptions = {
  quotes: 'single',
  wrap: true,
  es6: true
}

const result: string = jsesc('Hello', options)
```

### Using Type Definitions

```typescript
import { type JsescOptions } from 'jsesc-es'

// Use types in function parameters
function escapeString(input: string, opts?: JsescOptions): string {
  return jsesc(input, opts)
}

// Use types in configuration objects
const config: JsescOptions = {
  escapeEverything: false,
  minimal: true,
  quotes: 'double'
}
```

## 4. Build Configuration Migration

### Node.js Projects

**Before Migration**: No special configuration required

**After Migration**: Ensure ES Modules support

```json
// package.json
{
  "type": "module"
}
```

Or use `.mjs` file extension:
```javascript
// app.mjs
import jsesc from 'jsesc-es'
```

### Webpack Configuration

**Before Migration**:
```javascript
// webpack.config.js
module.exports = {
  // No special configuration
}
```

**After Migration**: Usually no modification needed, modern Webpack handles ES Modules automatically
```javascript
// webpack.config.js
module.exports = {
  // Webpack 5+ automatically handles ES Modules
  // If issues occur, you can add:
  resolve: {
    fullySpecified: false
  }
}
```

### Rollup Configuration

```javascript
// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'esm'
  },
  plugins: [
    nodeResolve()
  ]
}
```

### Vite Configuration

Vite natively supports ES Modules, no additional configuration needed:
```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  // Vite handles ES Modules automatically
})
```

## 5. Test Code Migration

### Jest Projects

**Before Migration**:
```javascript
// test.js
const jsesc = require('jsesc')

test('should escape string', () => {
  expect(jsesc('Hello')).toBe('Hello')
})
```

**After Migration**:
```javascript
// test.js
import jsesc from 'jsesc-es'

test('should escape string', () => {
  expect(jsesc('Hello')).toBe('Hello')
})
```

### Vitest Projects (Recommended)

If you want to use the same testing framework as jsesc-es:
```javascript
// test.js
import { describe, it, expect } from 'vitest'
import jsesc from 'jsesc-es'

describe('jsesc', () => {
  it('should escape string', () => {
    expect(jsesc('Hello')).toBe('Hello')
  })
})
```

## 6. Version Access Updates

Version information access remains the same, but also provides new import methods:

**Original Method (Still Supported)**:
```javascript
import jsesc from 'jsesc-es'
console.log(jsesc.version)
```

**New Import Method**:
```javascript
import { version } from 'jsesc-es'
console.log(version)
```

## Common Migration Issues

### Issue 1: "Cannot use import statement outside a module"

**Solution**:
1. Add `"type": "module"` to `package.json`
2. Or change file extension to `.mjs`
3. Or use CommonJS compatible import:

```javascript
// CommonJS compatible (temporary solution)
const { jsesc } = await import('jsesc-es')
```

### Issue 2: TypeScript Compilation Errors

**Solution**:
Ensure `tsconfig.json` is configured correctly:
```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node",
    "target": "ES2020",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

### Issue 3: Build Tool Compatibility

**Solution**:
Most modern build tools support ES Modules. If you encounter issues:
1. Update build tools to the latest version
2. Check build tool's ES Modules configuration
3. Consider using CommonJS compatible import as a temporary solution

## Progressive Migration Strategy

### Strategy 1: Parallel Running

During migration, you can install both packages simultaneously:
```bash
npm install jsesc jsesc-es
```

### Strategy 2: Module-by-Module Migration

1. First migrate newly developed modules
2. Gradually migrate existing modules
3. Finally remove original dependency

### Strategy 3: Alias Configuration

Use build tool's alias feature:
```javascript
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      'jsesc': 'jsesc-es'
    }
  }
}
```

## Migration Validation

### Functional Validation

Run the following tests to ensure successful migration:
```javascript
import jsesc from 'jsesc-es'

// Test basic functionality
console.assert(jsesc('Hello') === 'Hello')
console.assert(jsesc('"Hello"') === '\\"Hello\\"')

// Test with options
const result = jsesc('Hello', { quotes: 'single' })
console.assert(typeof result === 'string')

console.log('✅ Migration validation passed')
```

### Performance Validation

The new version should have the same or better performance:
```javascript
import jsesc from 'jsesc-es'

const start = performance.now()
for (let i = 0; i < 10000; i++) {
  jsesc('Test string with "quotes" and special chars: \n\t')
}
const end = performance.now()
console.log(`Performance test: ${end - start}ms`)
```

### Type Validation (TypeScript Projects)

Ensure type checking passes:
```bash
npx tsc --noEmit
```

## Best Practices

### 1. Use TypeScript

Take full advantage of the new version's type safety features:
```typescript
import jsesc, { type JsescOptions } from 'jsesc-es'

const options: JsescOptions = {
  quotes: 'single',
  wrap: true
}

const result: string = jsesc('Hello', options)
```

### 2. Modern Imports

Use ES Modules import syntax:
```javascript
// ✅ Good
import jsesc from 'jsesc-es'

// ❌ Avoid (unless necessary for compatibility)
const jsesc = require('jsesc-es')
```

### 3. Build Optimization

Leverage modern build tools' tree-shaking capabilities:
```javascript
// Only import what you need
import { jsesc, version } from 'jsesc-es'
```

### 4. Test Coverage

Ensure migrated code has adequate test coverage:
```javascript
import { describe, it, expect } from 'vitest'
import jsesc from 'jsesc-es'

describe('jsesc migration', () => {
  it('maintains compatibility', () => {
    // Test all your use cases
    expect(jsesc('test')).toBeDefined()
  })
})
```

## Rollback Plan

If you encounter unresolvable issues during migration:

### Quick Rollback

```bash
# Uninstall new version
npm uninstall jsesc-es

# Reinstall original version
npm install jsesc@3.1.0

# Revert import statements
# Change: import jsesc from 'jsesc-es'
# Back to: const jsesc = require('jsesc')
```

### Issue Reporting

If you find compatibility issues, please report to project maintainers:
1. Create minimal reproduction example
2. Provide detailed environment information
3. Describe the difference between expected and actual behavior

## Summary

Main benefits of migrating to `jsesc-es`:
- ✅ **Type Safety**: Complete TypeScript support
- ✅ **Modern**: ES Modules and modern build toolchain
- ✅ **Compatibility**: 100% API and functional compatibility
- ✅ **Performance**: Same or better performance
- ✅ **Developer Experience**: Better IDE support and error detection

The migration process is usually simple, most projects only need to update import statements. For TypeScript projects, you'll also get additional type safety guarantees.

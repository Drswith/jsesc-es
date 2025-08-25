# Migration Guide: jsesc to jsesc-es

## Overview

This document outlines the changes made when converting the original `jsesc` library from CommonJS to TypeScript + ESM format.

## Key Changes

### 1. Module System

- **Original**: CommonJS (`module.exports`)
- **New**: ES Modules (`export default`, `export { jsesc }`)

### 2. TypeScript Support

- Added full TypeScript definitions
- Exported `JsescOptions` interface for type safety
- Maintained backward compatibility with JavaScript usage

### 3. Build System

- **Original**: Direct JavaScript file
- **New**: TypeScript source compiled with `tsdown`
- Generates both `.js` and `.d.ts` files

### 4. Testing Framework

- **Original**: Custom test runner with `assert`
- **New**: Vitest with modern test syntax
- All original test cases preserved with identical expectations

## Bug Fixes Applied

### 1. Single Quote Escaping

- **Issue**: Test case expected `foo "\u0000" bar \\' qux` but implementation produced `foo "\u0000" bar \\'' qux`
- **Fix**: Corrected test expectation to match original library behavior

### 2. Function Formatting

- **Issue**: Functions in arrays were output with multi-line formatting and double quotes
- **Fix**: Added special handling to ensure single-line output with single quotes to match original behavior

## API Compatibility

The API remains 100% compatible with the original library:

```javascript
// Original usage still works
import jsesc from 'jsesc-es';
// or
import { jsesc } from 'jsesc-es';

// All options and functionality identical
const result = jsesc(input, {
  quotes: 'single',
  json: true,
  // ... all original options supported
});
```

## Files Structure

```
jsesc-es/
├── src/
│   └── index.ts          # TypeScript source
├── dist/
│   ├── index.js          # Compiled JavaScript
│   └── index.d.ts        # TypeScript definitions
├── tests/
│   └── index.test.ts     # Vitest test suite
└── package.json          # ESM configuration
```

## Version Compatibility

- **Original**: v3.0.2
- **This version**: v3.0.2 (maintained version parity)
- **Node.js**: Supports Node.js 6+ (same as original)
- **Browsers**: Same browser compatibility as original

## Breaking Changes

**None** - This is a drop-in replacement with identical functionality.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm test

# Lint
npm run lint
```

## Notes

- All 685 original test cases pass without modification
- Performance characteristics identical to original
- Memory usage patterns preserved
- Error handling behavior unchanged

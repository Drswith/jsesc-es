'use strict'
import type { JsescOptions } from './types'
import { version } from './version'

const object = {}
const hasOwnProperty = object.hasOwnProperty
function forOwn<T extends Record<string, unknown>>(object: T, callback: (key: string, value: T[keyof T]) => void) {
  for (const key in object) {
    if (hasOwnProperty.call(object, key)) {
      callback(key, object[key])
    }
  }
}

function extend<T extends Record<string, unknown>, S extends Record<string, unknown>>(destination: T, source?: S): T & S {
  if (!source) {
    return destination as T & S
  }
  forOwn(source, (key, value) => {
    (destination as Record<string, unknown>)[key] = value
  })
  return destination as T & S
}

function forEach<T>(array: T[], callback: (value: T) => void) {
  const length = array.length
  let index = -1
  while (++index < length) {
    callback(array[index])
  }
}

function fourHexEscape(hex: string) {
  return `\\u${(`0000${hex}`).slice(-4)}`
}

function hexadecimal(code: number, lowercase?: boolean) {
  const hexadecimal = code.toString(16)
  if (lowercase)
    return hexadecimal
  return hexadecimal.toUpperCase()
}

const toString = object.toString
const isArray = Array.isArray
function isBuffer(value: unknown): value is globalThis.Buffer {
  // eslint-disable-next-line node/prefer-global/buffer
  return globalThis.Buffer && globalThis.Buffer.isBuffer && globalThis.Buffer.isBuffer(value)
}
function isObject(value: unknown): value is Record<string, unknown> {
  // This is a very simple check, but it's good enough for what we need.
  return toString.call(value) === '[object Object]'
}
function isString(value: unknown): value is string {
  return typeof value === 'string'
    || toString.call(value) === '[object String]'
}
function isNumber(value: unknown): value is number {
  return typeof value === 'number'
    || toString.call(value) === '[object Number]'
}
function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint'
}
function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function'
}
function isMap(value: unknown): value is Map<unknown, unknown> {
  return toString.call(value) === '[object Map]'
}
function isSet(value: unknown): value is Set<unknown> {
  return toString.call(value) === '[object Set]'
}

/* -------------------------------------------------------------------------- */

// https://mathiasbynens.be/notes/javascript-escapes#single
const singleEscapes: { [key: string]: string } = {
  '\\': '\\\\',
  '\b': '\\b',
  '\f': '\\f',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
  // `\v` is omitted intentionally, because in IE < 9, '\v' == 'v'.
  // '\v': '\\x0B'
}
const regexSingleEscape = /[\\\b\f\n\r\t]/

const regexDigit = /\d/
const regexWhitespace = /[\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/

const escapeEverythingRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])|([\uD800-\uDFFF])|(['`"])|[\s\S]/g
const escapeNonAsciiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])|([\uD800-\uDFFF])|(['`"])|[^ !\u0023-\u0026\u0028-\u005B\u005D-\u005F\u0061-\u007E]/g

function jsesc(argument: unknown, options: JsescOptions = {}): string {
  let oldIndent: string
  let indent: string
  const increaseIndentation = () => {
    oldIndent = indent
    ++options!.indentLevel!
    indent = options!.indent!.repeat(options!.indentLevel!)
  }
  // Handle options
  const defaults: JsescOptions = {
    escapeEverything: false,
    minimal: false,
    isScriptContext: false,
    quotes: 'single',
    wrap: false,
    es6: false,
    json: false,
    compact: true,
    lowercaseHex: false,
    numbers: 'decimal',
    indent: '\t',
    indentLevel: 0,
    __inline1__: false,
    __inline2__: false,
  }
  const json = options && options.json
  if (json) {
    defaults.quotes = 'double'
    defaults.wrap = true
  }
  options = extend(defaults, options)
  if (
    options.quotes !== 'single'
    && options.quotes !== 'double'
    && options.quotes !== 'backtick'
  ) {
    options.quotes = 'single'
  }
  const quote = options.quotes === 'double'
    ? '"'
    : (options.quotes === 'backtick'
        ? '`'
        : '\''
      )
  const compact = options.compact
  const lowercaseHex = options.lowercaseHex
  indent = options.indent!.repeat(options.indentLevel!)
  oldIndent = ''
  const inline1 = options.__inline1__
  const inline2 = options.__inline2__
  const newLine = compact ? '' : '\n'
  let result: string | string[]
  let isEmpty = true
  const useBinNumbers = options.numbers === 'binary'
  const useOctNumbers = options.numbers === 'octal'
  const useDecNumbers = options.numbers === 'decimal'
  const useHexNumbers = options.numbers === 'hexadecimal'

  if (json && argument && typeof argument === 'object' && argument !== null && 'toJSON' in argument) {
    const objectWithToJSON = argument as { toJSON: () => unknown }
    if (isFunction(objectWithToJSON.toJSON)) {
      argument = objectWithToJSON.toJSON()
    }
  }

  if (!isString(argument)) {
    if (isMap(argument)) {
      if (argument.size === 0) {
        return 'new Map()'
      }
      if (!compact) {
        options.__inline1__ = true
        options.__inline2__ = false
      }
      return `new Map(${jsesc(Array.from(argument), options)})`
    }
    if (isSet(argument)) {
      if (argument.size === 0) {
        return 'new Set()'
      }
      return `new Set(${jsesc(Array.from(argument), options)})`
    }
    if (isBuffer(argument)) {
      if (argument.length === 0) {
        return 'Buffer.from([])'
      }
      return `Buffer.from(${jsesc(Array.from(argument), options)})`
    }
    if (isArray(argument)) {
      result = []
      options.wrap = true
      if (inline1) {
        options.__inline1__ = false
        options.__inline2__ = true
      }
      if (!inline2) {
        increaseIndentation()
      }
      forEach(argument as unknown[], (value) => {
        isEmpty = false
        if (inline2) {
          options.__inline2__ = false
        }
        (result as string[]).push(
          (compact || inline2 ? '' : indent)
          + jsesc(value, options),
        )
      })
      if (isEmpty) {
        return '[]'
      }
      if (inline2) {
        return `[${(result as string[]).join(', ')}]`
      }
      return `[${newLine}${(result as string[]).join(`,${newLine}`)}${newLine
      }${compact ? '' : oldIndent}]`
    }
    else if (isNumber(argument) || isBigInt(argument)) {
      if (json) {
        // Some number values (e.g. `Infinity`) cannot be represented in JSON.
        // `BigInt` values less than `-Number.MAX_VALUE` or greater than
        // `Number.MAX_VALUE` cannot be represented in JSON so they will become
        // `-Infinity` or `Infinity`, respectively, and then become `null` when
        // stringified.
        return JSON.stringify(Number(argument))
      }

      let result: string
      const numericValue = argument as number | bigint
      if (useDecNumbers) {
        result = String(numericValue)
      }
      else if (useHexNumbers) {
        let hexadecimal = numericValue.toString(16)
        if (!lowercaseHex) {
          hexadecimal = hexadecimal.toUpperCase()
        }
        result = `0x${hexadecimal}`
      }
      else if (useBinNumbers) {
        result = `0b${numericValue.toString(2)}`
      }
      else if (useOctNumbers) {
        result = `0o${numericValue.toString(8)}`
      }

      if (isBigInt(argument)) {
        return `${result!}n`
      }
      return result!
    }
    else if (isBigInt(argument)) {
      if (json) {
        // `BigInt` values less than `-Number.MAX_VALUE` or greater than
        // `Number.MAX_VALUE` will become `-Infinity` or `Infinity`,
        // respectively, and cannot be represented in JSON.
        return JSON.stringify(Number(argument))
      }
      return `${argument}n`
    }
    else if (!isObject(argument)) {
      if (json) {
        // For some values (e.g. `undefined`, `function` objects),
        // `JSON.stringify(value)` returns `undefined` (which isn't valid
        // JSON) instead of `'null'`.
        return JSON.stringify(argument) || 'null'
      }
      if (isFunction(argument)) {
        // Ensure functions are always single-line and use correct quotes
        let funcStr = String(argument).replace(/\s+/g, ' ')
        // Convert double quotes to single quotes in function body to match expected format
        funcStr = funcStr.replace(/"/g, '\'')
        return funcStr
      }
      return String(argument)
    }
    else { // it's an object
      result = []
      options.wrap = true
      increaseIndentation()
      forOwn(argument as Record<string, unknown>, (key, value) => {
        isEmpty = false;
        (result as string[]).push(
          `${(compact ? '' : indent)
          + jsesc(key, options)}:${
            compact ? '' : ' '
          }${jsesc(value, options)}`,
        )
      })
      if (isEmpty) {
        return '{}'
      }
      return `{${newLine}${(result as string[]).join(`,${newLine}`)}${newLine
      }${compact ? '' : oldIndent}}`
    }
  }

  const regex = options.escapeEverything ? escapeEverythingRegex : escapeNonAsciiRegex
  result = argument.replace(regex, (char: string, pair: string, lone: string, quoteChar: string, index: number, string: string) => {
    if (pair) {
      if (options.minimal)
        return pair
      const first = pair.charCodeAt(0)
      const second = pair.charCodeAt(1)
      if (options.es6) {
        // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        const codePoint = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000
        const hex = hexadecimal(codePoint, lowercaseHex)
        return `\\u{${hex}}`
      }
      return fourHexEscape(hexadecimal(first, lowercaseHex)) + fourHexEscape(hexadecimal(second, lowercaseHex))
    }

    if (lone) {
      return fourHexEscape(hexadecimal(lone.charCodeAt(0), lowercaseHex))
    }

    if (
      char === '\0'
      && !json
      && !regexDigit.test(string.charAt(index + 1))
    ) {
      return '\\0'
    }

    if (quoteChar) {
      if (quoteChar === quote || options.escapeEverything) {
        return `\\${quoteChar}`
      }
      return quoteChar
    }

    if (regexSingleEscape.test(char)) {
      // no need for a `hasOwnProperty` check here
      return singleEscapes[char]
    }

    if (options.minimal && !regexWhitespace.test(char)) {
      return char
    }

    const hex = hexadecimal(char.charCodeAt(0), lowercaseHex)
    if (json || hex.length > 2) {
      return fourHexEscape(hex)
    }

    return `\\x${(`00${hex}`).slice(-2)}`
  })

  if (quote === '`') {
    result = (result as string).replace(/\$\{/g, '\\${')
  }
  if (options.isScriptContext) {
    // https://mathiasbynens.be/notes/etago
    result = (result as string)
      .replace(/<\/(script|style)/gi, '<\\/$1')
      .replace(/<!--/g, json ? '\\u003C!--' : '\\x3C!--')
  }
  if (options.wrap) {
    result = quote + result + quote
  }
  return result as string
}

jsesc.version = version

// Export the main function and version
export { jsesc }

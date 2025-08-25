export interface JsescOptions {
  escapeEverything?: boolean
  minimal?: boolean
  isScriptContext?: boolean
  quotes?: 'single' | 'double' | 'backtick'
  wrap?: boolean
  es6?: boolean
  json?: boolean
  compact?: boolean
  lowercaseHex?: boolean
  numbers?: 'decimal' | 'binary' | 'octal' | 'hexadecimal'
  indent?: string
  indentLevel?: number
  __inline1__?: boolean
  __inline2__?: boolean
  [key: string]: unknown
}

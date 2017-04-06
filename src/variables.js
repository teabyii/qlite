// https://infra.spec.whatwg.org/#ascii-whitespace
export const RE_NOTHTMLWHITE = /[^\x20\t\r\n\f]+/g

export const RE_TAGNAME = /^\s*<(\w+|!)[^>]*>/
export const RE_SINGLETAG = /^<([a-z][^/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/
export const RE_TAGEXPANDER = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi

// Unique identification for QLite in each page.
export const expando = `QLite${Math.random()}`.replace(/\D/g, '')

// For Node.js environment
export const win = window || {
  document: global.document,
  Node: {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11
  }
}

export const Node = win.Node

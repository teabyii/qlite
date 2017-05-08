// https://infra.spec.whatwg.org/#ascii-whitespace
export const RE_NOTHTMLWHITE = /[^\x20\t\r\n\f]+/g

export const RE_TAGNAME = /^\s*<(\w+|!)[^>]*>/
export const RE_SINGLETAG = /^<([a-z][^/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/
export const RE_TAGEXPANDER = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi

// Unique identification for QLite in each page.
export const expando = `QLite${Math.random()}`.replace(/\D/g, '')

// Unique ID
export let guid = 1

// Variables in window
export const Node = window.Node
export const document = window.document

export const returnFalse = () => false
export const returnTrue = () => true

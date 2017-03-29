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

/**
 * A element node or document node, or document fragment node?
 *
 * @export
 * @param {Node} node
 * @returns
 */
export function isGoodNode (node) {
  if (!node) {
    return false
  }

  const type = node.nodeType

  return type === Node.ELEMENT_NODE ||
    type === Node.DOCUMENT_NODE ||
    type === Node.DOCUMENT_FRAGMENT_NODE
}

// https://infra.spec.whatwg.org/#ascii-whitespace
export const RE_NOTHTMLWHITE = /[^\x20\t\r\n\f]+/g

/**
 * Strip and collapse whitespace according to HTML spec
 * https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
 *
 * @export
 * @param {string} value
 * @returns {string}
 */
export function stripAndCollapse (value) {
  return (value.match(RE_NOTHTMLWHITE) || []).join(' ')
}

// Unique identification for QLite in each page.
export const expando = `QLite${Math.random()}`.replace(/\D/g, '')

export function attach (owner, key, value) {
  let store = owner[expando]

  // Check if the owner object already has a store
  if (!store) {
    store = owner[expando] = {}
  }

  if (!key) {
    return store
  }

  if (!value) {
    return store[key]
  } else {
    store[key] = value
    return value
  }
}

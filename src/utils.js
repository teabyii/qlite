import { RE_NOTHTMLWHITE, Node, expando } from './variables'

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

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

const Node = win.Node

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

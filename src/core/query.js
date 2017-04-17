import { isGoodNode } from './utils'
import { document, Node } from '../core/variables'
const RE_SIMPLE = /^(?:\.|#)?([\w-]+)$/

/**
 * Query elements in context|document by selector.
 *
 * @export
 * @param {string} selector
 * @param {Node} context
 * @returns {Node[]}
 */
export default function query (selector, context) {
  if (!selector) {
    return []
  }

  let parent = null
  if (context) {
    if (isGoodNode(context)) {
      parent = context
    } else if (context.length && isGoodNode(context[0])) {
      parent = context[0]
    }
  }

  parent = parent || document

  function callContextMethod (context, method, name, selector) {
    if (context[method]) {
      const result = context[method](name)
      return method === 'getElementById' ? [result] : result
    } else {
      return context.querySelectorAll(selector)
    }
  }

  if (RE_SIMPLE.test(selector)) {
    if (selector[0] === '#') {
      // ID
      return callContextMethod(parent, 'getElementById', RegExp.$1, selector)
    } else if (selector[0] === '.') {
      // ClassName
      return callContextMethod(parent, 'getElementsByClassName', RegExp.$1, selector)
    } else {
      // Tag
      return callContextMethod(parent, 'getElementsByTagName', RegExp.$1, selector)
    }
  }

  return parent.querySelectorAll(selector)
}

/**
 * Determine if the element would be selected by the specified selector string
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
 *
 * @export
 * @param {Node} node
 * @param {string} selector
 */
export function matches (node, selector) {
  if (!node || !selector || node.nodeType !== Node.ELEMENT_NODE) {
    return false
  }

  const fn = node.matches ||
    node.webkitMatchesSelector ||
    node.mozMatchesSelector ||
    node.oMatchesSelector ||
    node.msMatchesSelector

  if (fn) {
    return fn.call(node, selector)
  }

  return [].indexOf.call(query(selector), node) !== -1
}

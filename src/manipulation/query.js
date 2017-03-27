import { win, isGoodNode } from '../utils'

const document = win.document
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

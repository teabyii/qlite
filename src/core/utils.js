import { RE_NOTHTMLWHITE, expando, Node } from './variables'

/**
 * Creates a duplicate-free version of an array
 *
 * @export
 * @param {Array} array
 * @returns
 */
export function uniq (array) {
  if (array && array.length) {
    return [].filter.call(array, (item, index) => array.indexOf(item) === index)
  } else {
    return []
  }
}

/**
 * Get values from a named property of each item in the collection
 *
 * @export
 * @param {string} property
 * @param {boolean} first
 * @returns
 */
export function pluck (array, property, first) {
  if (!Array.isArray(array) || !array[0]) {
    return undefined
  }

  if (first) {
    return array[0][property]
  } else {
    return array.map(item => item[property])
  }
}

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

export function isXML (node) {
  // documentElement is verified for cases where it doesn't yet exist
  // (such as loading iframes in IE - #4833)
  const documentElement = node && (node.ownerDocument || node).documentElement
  return documentElement ? documentElement.nodeName !== 'HTML' : false
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

/**
 * Attach data to owner
 *
 * @export
 * @param {Object} owner
 * @param {string} key
 * @param {any} value
 * @returns
 */
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

/**
 * Multifunctional method to get and set values of a collection
 * Reference:
 * https://github.com/jquery/jquery/blob/master/src/core/access.js
 *
 * @export
 * @param {Array} items
 * @param {Function} fn
 * @param {string} key
 * @param {any} value
 */
export function access (items, fn, key, value) {
  // Multi keys
  if (typeof key === 'object') {
    for (let i in key) {
      access(items, fn, i, key[i])
    }

    return items
  } else if (value !== undefined) {
    const valueAsFunc = (typeof value === 'function')

    if (!key) {
      if (valueAsFunc) {
        const callback = fn
        fn = function (item, key, value) {
          return callback(item, value)
        }
      } else {
        fn(items, value)
        fn = null
      }
    }

    if (typeof fn === 'function') {
      items.forEach((item, index) => {
        fn(item, key, valueAsFunc ? value(item, index, fn(item, key)) : value)
      })
    }

    return items
  }

  return items.length ? fn(items[0], key) : undefined
}

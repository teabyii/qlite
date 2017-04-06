import QLite from '../qlite'
import { access } from '../utils'
import { RE_NOTHTMLWHITE, Node } from '../variables'

QLite.fn.extend({
  attr (name, value) {
    return access(this, attr, name, value)
  },

  removeAttr (name) {
    if (name) {
      this.forEach(node => {
        removeAttr(node, name)
      })
    }

    return this
  }
})

/**
 * Get/Set attributes of element
 *
 * @export
 * @param {Node} node
 * @param {string} name
 * @param {string} value
 * @returns
 */
export function attr (node, name, value) {
  const nodeType = node.nodeType

  if (
    nodeType === Node.TEXT_NODE ||
    nodeType === Node.COMMENT_NODE ||
    nodeType === Node.ATTRIBUTE_NODE
  ) {
    return
  }

  // Fallback
  if (typeof node.getAttribute === 'undefined') {
    node[name] = value
  }

  if (value !== undefined) {
    if (value === null) {
      removeAttr(node, name)
      return
    }

    node.setAttribute(name, String(value))
    return value
  } else {
    if (node.getAttribute) {
      return node.getAttribute(name)
    } else {
      return node[name] || undefined
    }
  }
}

/**
 * Remove attribute of element
 *
 * @export
 * @param {Node} node
 * @param {string} name
 */
export function removeAttr (node, name) {
  if (name) {
    const attrNames = name.match(RE_NOTHTMLWHITE)

    if (attrNames && node.nodeType === Node.ELEMENT_NODE) {
      let i = 0
      let attribute

      while ((attribute = attrNames[i++])) {
        node.removeAttribute(attribute)
      }
    }
  }
}

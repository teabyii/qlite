import qlite from '../index'
import { isXML, access, stripAndCollapse } from '../core/utils'
import { Node } from '../core/variables'

// https://github.com/jquery/jquery/blob/master/src/attributes/prop.js#L128
export const propFix = [
  'tabIndex',
  'readOnly',
  'maxLength',
  'cellSpacing',
  'cellPadding',
  'rowSpan',
  'colSpan',
  'useMap',
  'frameBorder',
  'contentEditable'
].reduce((target, item) => {
  target[item.toLowerCase()] = item
  return target
}, {})

qlite.fn.extend({
  prop (name, value) {
    return access(this, prop, name, value)
  },

  removeProp (name) {
    this.forEach(node => {
      delete node[propFix[name] || name]
    })

    return this
  },

  val (value) {
    const node = this[0]
    const nodeName = node.nodeName.toLowerCase()

    // For option without "value"
    if (nodeName === 'option' && !value) {
      return prop(node, 'value') || stripAndCollapse(node.innerText)
    }

    // The value of '<select>' comes from it's options
    if (nodeName === 'select') {
      const options = node.options

      if (value) {
        // Value setter in <select>
        let optionSet = false
        let i = options.length
        const values = Array.isArray(value) ? value : [value]

        while (i--) {
          const option = options[i]
          if (values.indexOf(prop(option, 'value')) > -1) {
            option.selected = true
            optionSet = true
          }
        }

        if (!optionSet) {
          node.selectedIndex = -1
        }

        return values
      } else {
        // Value getter in <select>
        const index = node.selectedIndex
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/type
        const isOne = node.type === 'select-one'
        const results = isOne ? null : []
        const max = isOne ? index + 1 : options.length

        let i = 0
        if (index < 0) {
          i = max
        } else {
          i = isOne ? index : 0
        }

        for (; i < max; i++) {
          const option = options[i]

          if (
            // Support: IE <=9 only
            // IE8-9 doesn't update selected after form reset (#2551)
            (option.selected || i === index) &&
            !option.disabled &&
            (
              // Don't return options that are disabled or in a disabled optgroup
              !option.parentNode.disabled ||
              option.parentNode.nodeName.toLowerCase() !== 'optgroup'
            )
          ) {
            if (isOne) {
              return prop(option, 'value')
            } else {
              results.push(prop(option, 'value'))
            }
          }
        }

        return results
      }
    }

    return access(this, prop, 'value', value)
  }
})

/**
 * Get/Set properties of element
 *
 * @export
 * @param {Node} node
 * @param {string} name
 * @param {any} value
 */
export function prop (node, name, value) {
  const nodeType = node.nodeType

  if (
    nodeType === Node.TEXT_NODE ||
    nodeType === Node.COMMENT_NODE ||
    nodeType === Node.ATTRIBUTE_NODE
  ) {
    return
  }

  if (nodeType !== Node.ELEMENT_NODE || !isXML(node)) {
    name = propFix[name] || name
  }

  if (value !== undefined) {
    return (node[name] = value)
  }

  return node[name]
}

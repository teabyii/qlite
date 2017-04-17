import { isGoodNode } from './core/utils'
import query from './core/query'
import fragment from './core/fragment'
import ready from './core/ready'
import { RE_TAGNAME } from './core/variables'

// MyArray to inherit methods from Buildin Array.
function MyArray () {
  const args = [].slice.call(arguments, 0)
  this.push.apply(this, args)
  return this
}

MyArray.prototype = Object.create(Array.prototype)

/**
 * QLite wapper for elements
 *
 * @export
 * @class QLite
 * @extends {QLiteBase}
 */
class QLite extends MyArray {
  /**
   * Creates an instance of QLite.
   * @param {string|Node|Node[]} selector
   * @param {Node|Node[]|QLite} context
   *
   * @memberOf QLite
   */
  constructor (selector, context) {
    let elems = []

    if (!selector) {
      elems = []
    } else {
      if (typeof selector === 'string') {
        selector = selector.trim()

        if (
          selector[0] === '<' &&
          RE_TAGNAME.test(selector)
        ) {
          // HTML Fragment
          elems = fragment(selector)
        } else {
          // selector
          elems = query(selector, context && new QLite(context))
        }
      } else if (typeof selector === 'object' && isGoodNode(selector)) {
        elems = [selector]
      } else if (selector.length && selector[0]) { // Array-like to QLite
        elems = selector
      }
    }

    super()

    // Move elems to this.
    const len = elems.length
    for (let i = 0; i < len; i++) {
      if (elems[i] && isGoodNode(elems[i])) {
        this.push(elems[i])
      }
    }

    // DOM ready
    if (typeof selector === 'function') {
      this.push(document)
      ready(selector)
    }

    // Special properties
    this.QLite = true
    this.selector = selector || ''
  }

  merge(array) {
    const len = array.length
    for (let i = 0; i <= len; i++) {
      this.push(array[i])
    }
    return this
  }
}

function extend () {
  const args = [].slice.call(arguments, 0)

  if (args.length === 1) {
    args.unshift(this)
  }

  return Object.assign.apply(Object, args)
}

QLite.fn = QLite.prototype
QLite.fn.extend = QLite.extend = extend

/**
 * Entry qlite, like jQuery function.
 *
 * @export
 * @param {String|Node|Node[]} selector
 * @param {Node} context
 */
function qlite (selector, context) {
  return new QLite(selector, context)
}

qlite.fn = QLite.fn

export default qlite

import QLite from './qlite'

import './mixins/classname'
import './mixins/attributes'
import './mixins/properties'

/**
 * Entry qlite, like jQuery function.
 *
 * @export
 * @param {String|Node|Node[]} selector
 * @param {Node} context
 */
export default function qlite (selector, context) {
  return new QLite(selector, context)
}

qlite.fn = QLite.fn

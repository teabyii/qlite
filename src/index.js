import QLite from './qlite'

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

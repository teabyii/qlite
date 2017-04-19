import qlite from '../index'
import { uniq } from '../core/utils'
import { Node } from '../core/variables'
import { matches } from '../core/query'

qlite.fn.extend({
  is (selector) {
    return this.length ? Boolean(winnow(this, selector).length) : false
  },

  not (selector) {
    return this.length ? winnow(this, selector, true) : this
  },

  add (selector, context) {
    qlite(selector, context).forEach(item => this.push(item))
    return uniq(this)
  },

  parent (selector) {
    return obtain(this, elem => {
      const parent = elem.parentNode
      return parent && parent.nodeType !== Node.DOCUMENT_FRAGMENT_NODE ? [parent] : []
    }, selector)
  },

  parents (selector) {
    return obtain(this, elem => recur(elem, 'parentNode'), selector)
  },

  parentsUntil (until, selector) {
    return obtain(this, elem => recur(elem, 'parentNode', until), selector)
  },

  closest (selector, context) {
    return obtain(this, elem => {
      for (; elem && elem !== context; elem = elem.parentNode) {
        const result = [elem]
        if (elem.nodeType < 11 && winnow(result, selector).length) {
          return result
        }
      }
    })
  },

  next (selector) {
    return obtain(this, elem => skip(elem, 'nextSibling'), selector, true)
  },

  nextAll (selector) {
    return obtain(this, elem => recur(elem, 'nextSibling'), selector)
  },

  nextUntil (until, selector) {
    return obtain(this, elem => recur(elem, 'nextSibling', until), selector)
  },

  prev (selector) {
    return obtain(this, elem => skip(elem, 'previousSibling'), selector, true)
  },

  prevAll (selector) {
    return obtain(this, elem => recur(elem, 'previousSibling'), selector)
  },

  prevUntil (until, selector) {
    return obtain(this, elem => recur(elem, 'previousSibling', until), selector)
  },

  siblings (selector) {
    return obtain(this, elem => siblings((elem.parentNode || {}).firstChild, elem), selector)
  },

  children (selector) {
    return obtain(this, elem => siblings(elem.firstChild), selector, true)
  },

  contents () {
    return obtain(this, elem => {
      if (elem) {
        if (elem.nodeName === 'iframe') {
          return elem.contentDocument
        }

        if (elem.nodeName === 'template') {
          return elem.content || elem
        }

        return elem.childNodes
      } else {
        return []
      }
    })
  }
})

export function obtain (elements, fn, qualifier, guaranteedUnique = false) {
  let result = qlite()
  if (elements.length) {
    const t = elements.reduce((result, item) => {
      const target = fn(item)
      if (target) {
        result.merge(target)
      }
      return result
    }, result)

    result = winnow(t, qualifier)
    return guaranteedUnique ? qlite(uniq(result)) : result
  } else {
    return qlite()
  }
}

/**
 * Get elements which matches qualifier
 *
 * @export
 * @param {Node[]} elements
 * @param {function|Node|Array|string} qualifier
 * @param {boolean} not
 * @returns
 */
export function winnow (elements, qualifier, not = false) {
  if (!qualifier) {
    return elements
  }

  if (typeof qualifier === 'function') {
    return elements
      .filter((element, index) => Boolean(qualifier(element, index)) !== not)
  }

  if (qualifier.nodeType) {
    return elements
      .filter(element => (element === qualifier) !== not)
  }

  if (typeof qualifier !== 'string') {
    return elements
      .filter(element => (qualifier.indexOf(element) !== -1) !== not)
  }

  return elements
    .filter(element => matches(element, qualifier) !== not)
}

/**
 * Get elements recursively
 * https://github.com/jquery/jquery/blob/master/src/traversing/var/recur.js
 *
 * @export
 * @param {Node} elem
 * @param {string} recur
 * @param {string} utils
 * @param {Node} target
 */
export function recur (elem, recur, until) {
  const result = []

  while ((elem = elem[recur]) && elem.nodeType !== Node.DOCUMENT_NODE) {
    if (elem.nodeType === Node.ELEMENT_NODE) {
      if (until && winnow([elem], until).length) {
        break
      }

      result.push(elem)
    }
  }

  return result
}

/**
 *
 * https://github.com/jquery/jquery/blob/master/src/traversing.js#L107
 *
 * @export
 * @param {Node} elem
 * @param {string} key
 */
export function skip (elem, key) {
  while ((elem = elem[key]) && elem.nodeType !== Node.ELEMENT_NODE) {
    // nothing
  }

  return elem ? [elem] : []
}

/**
 *
 * https://github.com/jquery/jquery/blob/master/src/traversing/var/siblings.js
 *
 * @export
 * @param {any} t
 * @param {any} elem
 * @returns
 */
export function siblings (t, elem) {
  const matched = []

  do {
    if (t.nodeType === Node.ELEMENT_NODE && t !== elem) {
      matched.push(t)
    }
  } while ((t = t.nextSibling))

  return matched
}

import QLite from '../qlite'
import { stripAndCollapse, attach } from '../utils'
import { RE_NOTHTMLWHITE, Node } from '../variables'

QLite.fn.extend({
  addClass (value) {
    if (typeof value === 'function') {
      return this.forEach((node, index) => {
        addClass(node, value.call(node, index, getClass(node)))
      })
    }

    if (typeof value === 'string' && value) {
      return this.forEach(node => {
        addClass(node, value)
      })
    }

    return this
  },

  removeClass (value) {
    if (typeof value === 'function') {
      return this.forEach((node, index) => {
        removeClass(node, value.call(node, index, getClass(node)))
      })
    }

    if (typeof value === 'string' && value) {
      return this.forEach(node => {
        removeClass(node, value)
      })
    }

    if (value === undefined || value === null) {
      return this.forEach(node => {
        removeClass(node, value)
      })
    }

    return this
  },

  hasClass (classname) {
    classname = ` ${classname} `

    return this.some(node => {
      return hasClass(node, classname)
    })
  },

  toggleClass (value, state) {
    const type = typeof value

    if (typeof state === 'boolean' && type === 'string') {
      return state ? this.addClass(value) : this.removeClass(value)
    }

    if (type === 'function') {
      return this.forEach((node, index) => {
        new QLite(node).toggleClass(
          value.call(node, index, getClass(node), state),
          state
        )
      })
    }

    return this.forEach(node => {
      if (type === 'string') {
        const classes = value.match(RE_NOTHTMLWHITE) || []
        let i = 0
        let classname = classes[i++]

        while (classname) {
          hasClass(node, classname)
            ? removeClass(node, classname) : addClass(node, classname)

          classname = classes[i++]
        }
      } else if (value === undefined || type === 'boolean') {
        const classname = getClass(node)

        if (classname) {
          // Store classname if set
          attach(node, '__classname__', classname)
        }

        if (node.setAttribute) {
          const finalValue = classname || value === false
            ? '' : attach(node, '__classname__')
          node.setAttribute('class', finalValue)
        }
      }
    })
  }
})

/**
 * Get node `class` attribute.
 *
 * @export
 * @param {Node} node
 * @returns
 */
export function getClass (node) {
  return (node.getAttribute && node.getAttribute('class')) || ''
}

export function hasClass (node, classname) {
  if (
    node.nodeType === Node.ELEMENT_NODE &&
    ` ${stripAndCollapse(getClass(node))} `.indexOf(classname) > -1
  ) {
    return true
  } else {
    return false
  }
}

export function addClass (node, value) {
  if (!value) {
    return
  }

  const classes = value.match(RE_NOTHTMLWHITE) || []
  const current = getClass(node)

  if (node.nodeType === Node.ELEMENT_NODE) {
    let target = ` ${stripAndCollapse(current)} `
    let i = 0
    let classname = classes[i++]

    while (classname) {
      if (current.indexOf(` ${classname} `) < 0) {
        target += `${classname} `
      }

      classname = classes[i++]
    }

    const finalValue = stripAndCollapse(target)
    // Only assign if different to avoid unneeded rendering.
    if (finalValue !== current) {
      node.setAttribute('class', finalValue)
    }
  }
}

export function removeClass (node, value) {
  const current = getClass(node)

  if (node.nodeType === Node.ELEMENT_NODE) {
    if (!value) {
      node.setAttribute('class', '')
    } else {
      const classes = value.match(RE_NOTHTMLWHITE) || []
      let target = ` ${stripAndCollapse(current)}`
      let i = 0
      let classname = classes[i++]

      while (classname) {
        if (current.indexOf(` ${classname} `) < 0) {
          target = target.replace(` ${classname}`, ' ')
        }

        classname = classes[i++]
      }

      const finalValue = stripAndCollapse(target)
      // Only assign if different to avoid unneeded rendering.
      if (finalValue !== current) {
        node.setAttribute('class', finalValue)
      }
    }
  }
}

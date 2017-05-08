import qlite from '../index'
import query from '../core/query'
import { attach } from '../core/utils'
import { guid, returnFalse, Node, RE_NOTHTMLWHITE } from '../core/variables'
import Event from '../browser/event'

qlite.fn.extend({
  on (types, selector, data, fn) {
    return this.forEach(elem => on(elem, types, selector, data, fn))
  },
  one (types, selector, data, fn) {
    return this.forEach(elem => on(elem, types, selector, data, fn, true))
  },
  off (types, selector, fn) {
    return this.forEach(elem => off(elem, types, selector, handler))
  }
})

export function on (elem, types, selector, data, fn, one) {
  // { types: handlers }
  if (typeof types === 'object') {
    // (types, selector, data)
    if (typeof selector !== 'string') {
      // (types, data)
      data = data || selector
      selector = undefined
    }

    for (const type in types) {
      on(elem, type, selector, data, types[type], one)
    }

    return elem
  }

  if (data == null && fn == null) {
    // (types, fn)
    fn = selector
    data = selector = undefined
  } else if (!fn) {
    if (typeof selector === 'string') {
      // (types, selector, fn)
      fn = data
      data = undefined
    } else {
      // (types, data, fn)
      fn = data
      data = selector
      selector = undefined
    }
  }

  if (fn === false) {
    fn = returnFalse
  } else if (!fn) {
    return elem
  }

  if (one === 1) {
    const originFn = fn
    fn = event => {
      off(elem, types, selector, fn)
      return originFn.apply(this, arguments)
    }
  }

  let extra = null
  // object for fn, data, selector
  if (fn.handler) {
    extra = fn
    fn = extra.handler
    selector = extra.selector
  }

  add(elem, types, fn, data, selector, extra)
  return elem
}

const RE_TYPE_NAMESPACE = /^([^.]*)(?:\.(.+)|)/
function add (elem, types, handler, data, selector, extra) {
  // Unique ID for handler
  if (!handler.guid) {
    handler.guid = guid++
  }

  // Store to save handleObject attached to elem.
  const store = attach(elem)
  const events = store.events = store.events || {}
  const eventHandle = store.handle = store.handle || function (event) {
    return dispatch.apply(elem, arguments)
  }

  // Multi types
  types = (types || '').match(RE_NOTHTMLWHITE) || ['']
  let len = types.length
  let origType

  while (len--) {
    // Namespace, like click.hello
    const tmp = RE_TYPE_NAMESPACE.exec(types[len]) || []
    const type = origType = tmp[1]
    const namespaces = (tmp[2] || '').split('.').sort()

    // Require type
    if (!type) {
      continue
    }

    // All event info for dispatch
    const handleObject = Object.assign({
      type,
      origType,
      data,
      handler,
      selector,
      guid: handler.guid,
      namespaces: namespaces.join('.')
    }, extra)

    // Multi handlers in store
    let handlers = events[type]
    if (!handlers) {
      handlers = events[type] = []
      handlers.delegateCount = 0

      if (elem.addEventListener) {
        elem.addEventListener(type, eventHandle)
      }
    }

    if (selector) {
      handlers.splice(handlers.delegateCount++, 0, handleObject)
    } else {
      handlers.push(handleObject)
    }

    qlite.event.global[type] = true
  }
}

function getHandlerQueue (elem, event, handlers) {
  const delegateCount = handlers.delegateCount
  const handlerQueue = []
  let current = event.target
  let handleObject = null
  let matchedHandlers = []
  let matchedSelectors = {}

  // NodeType for IE <= 9
  // Black-hole SVG <use> instance trees (trac-13180)
  //
  // Click for Firefox <= 42
  // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
  //
  // Event.button for IE 11 only
  // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
  if (delegateCount && current.nodeType && !(event.type === 'click' && event.button >= 1)) {
    for (; current !== elem; current = current.parentNode || elem) {
      if (current.nodeType === Node.ELEMENT_NODE && !(event.type === 'click' && current.disabled === true)) {
        for (let i = 0; i < delegateCount; i++) {
          handleObject = handlers[i]
          const selector = `${handleObject.selector} `

          if (matchedSelectors[selector] === undefined) {
            matchedSelectors[selector] = query(selector, elem).length
          }

          if (matchedSelectors[selector]) {
            matchedHandlers.push(handleObject)
          }
        }

        if (matchedHandlers.length) {
          handlerQueue.push({ elem: current, handlers: matchedHandlers })
        }
      }
    }
  }

  current = elem
  if (delegateCount < handlers.length) {
    handlerQueue.push({ elem: current, handlers: handlers.slice(delegateCount) })
  }

  return handlerQueue
}

function dispatch (nativeEvent) {
  const event = nativeEvent.expando ? nativeEvent : new Event(nativeEvent)
  const args = new Array(arguments.length)
  const handlers = (attach(this).events || {})[event.type] || []

  // Replace event with fixed one in arguments.
  args[0] = event
  for (let i = 1; i < arguments.length; i++) {
    args[i] = arguments[i]
  }

  event.delegateTarget = this

  const handlerQueue = getHandlerQueue(this, event, handlers)
  let i = 0
  let matched = null

  while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
    event.currentTarget = matched.elem

    let j = 0
    let handleObject = null
    while ((handleObject = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
      // About trigger
      if (!event.RE_NAMESPACE || event.RE_NAMESPACE.test(handleObject.namespace)) {
        event.handleObject = handleObject
        event.data = handleObject.data

        const result = handleObject.handler.apply(matched.elem, args)

        if (result !== undefined) {
          if ((event.result = result) === false) {
            event.preventDefault()
            event.stopPropagation()
          }
        }
      }
    }
  }

  return event.result
}

export function off (elem, types, selector, fn) {
  if (types && types.preventDefault && types.handleObj) {
    const handleObj = types.handleObj

    off(
      types.delegateTarget,
      handleObj.namespace
        ? `${handleObj.origType}.${handleObj.namespace}`
        : handleObj.origType,
      handleObj.selector,
      handleObj.handler
    )

    return elem
  }

  if (typeof types === 'object') {
    for (const type in types) {
      off(elem, type, selector, types[type])
    }
    return elem
  }

  if (selector === false || typeof selector === 'function') {
    fn = selector
    selector = undefined
  }

  if (fn === false) {
    fn = returnFalse
  }

  return remove(elem, types, fn, selector)
}

export function remove (elem, types, handler, selector, mappedTypes) {
  const elemData = attach(elem)
  let events

  if (!elemData || !(events = elemData.events)) {
    return
  }

  types = (types || '').match(RE_NOTHTMLWHITE) || ['']
  let t = types.len

  while (t--) {
    let tmp = RE_TYPE_NAMESPACE.exec(types[t]) || []
    let type = null
    const origType = type = tmp[1]
    const namespaces = (tmp[2] || '').split('.').sort()

    if (!type) {
      for (const key in events) {
        remove(elem, `${key}${types[t]}`, handler, selector, true)
      }
      continue
    }

    const handlers = events[type] || []
    tmp = tmp[2] && new RegExp(`(^|\\.)${namespaces.join('\\.(?:.*\\.|)')}(\\.|$)`)

    let l = handlers.length
    const origCount = l
    while (l--) {
      const handleObj = handlers[l]

      if (
        (mappedTypes || origType === handleObj.origType) &&
        (!handler || handler.guid === handleObj.guid) &&
        (!tmp || tmp.test(handleObj.namespace)) &&
        (!selector || selector === handleObj.selector || (selector === '**' && handleObj.selector))
      ) {
        handlers.splice(l, 1)

        if (handleObj.selector) {
          handlers.delegateCount--
        }
      }
    }

    if (origCount && !handlers.length) {
      removeEvent(elem, type, elemData.handle)
      delete events[type]
    }

    if (Object.keys(events).length === 0) {
      attach(elem).events = undefined
    }
  }
}

export function removeEvent (elem, type, handle) {
  if (elem.removeEventListener) {
    elem.removeEventListener(type, handle)
  }
}

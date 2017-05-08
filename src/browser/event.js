import { returnTrue, returnFalse, Node, expando } from '../core/variables'

/**
 * Based on DOM3 Events as specified by the ECMAScript Language Binding
 * https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
 *
 * @export
 * @class Event
 */
export default class Event {
  constructor (src, props) {
    if (src && src.type) {
      this.originalEvent = src
      this.type = src.type

      this.isDefaultPrevented = (src.defaultPrevented || src.defaultPrevented === undefined)
        ? returnTrue : returnFalse

      //
      this.target = (src.target && src.target.nodeType === Node.TEXT_NODE)
        ? src.target.parentNode : src.target

      this.currentTarget = src.currentTarget
      this.relatedTarget = src.relatedTarget
    } else {
      this.type = src
    }

    //
    if (props) {
      Object.assign(this, props)
    }

    this.timeStamp = src && src.timeStamp ? src.timeStamp : Date.now()
    this[expando] = true
  }

  preventDefault () {
    this.isDefaultPrevented = returnTrue
    const e = this.originalEvent
    e && e.preventDefault()
  }

  stopPropagation () {
    this.isPropagationStopped = returnTrue
    const e = this.originalEvent
    e && e.stopPropagation()
  }

  stopImmediatePropagation () {
    this.isImmediatePropagationStopped = returnTrue
    const e = this.originalEvent
    e && e.stopImmediatePropagation()
    this.stopPropagation()
  }
}

function quickDefineProperty (fn, name, getter) {
  Object.defineProperty(fn, name, {
    enumerable: true,
    configurable: true,
    get: getter,
    set (value) {
      Object.defineProperty(this, name, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: value
      })
    }
  })
}

;[
  'isDefaultPrevented',
  'isPropagationStopped',
  'isImmediatePropagationStopped'
].forEach(name => {
  quickDefineProperty(Event.prototype, name, returnFalse)
})

;[
  'altKey', 'bubbles', 'cancelable',
  'changedTouches', 'ctrlKey', 'detail',
  'eventPhase', 'metaKey', 'pageX',
  'pageY', 'shiftKey', 'view',
  'char', 'charCode', 'key',
  'keyCode', 'button', 'buttons',
  'clientX', 'clientY', 'offsetX',
  'offsetY', 'pointerId', 'pointerType',
  'screenX', 'screenY', 'targetTouches',
  'toElement', 'touches'
].forEach(name => {
  quickDefineProperty(Event.prototype, name, function () {
    if (this.originalEvent) {
      return this.originalEvent[name]
    }
  })
})

const RE_KEY_EVENT = /^key/
const RE_MOUSE_EVENT = /^(?:mouse|pointer|contextmenu|drag|drop)|click/
// which
quickDefineProperty(Event.prototype, 'which', function (event) {
  const button = event.button

  if (event.which == null && RE_KEY_EVENT.test(event.type)) {
    return event.charCode != null ? event.charCode : event.keyCode
  }

  if (!event.which && button !== undefined && RE_MOUSE_EVENT.test(event.type)) {
    if (button & 1) {
      return 1
    }

    if (button & 2) {
      return 3
    }

    if (button & 4) {
      return 2
    }

    return 0
  }

  return event.which
})

import support from '../support'

export const RE_TAGNAME = /^\s*<(\w+|!)[^>]*>/
const RE_SINGLETAG = /^<([a-z][^/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/
const RE_TAGEXPANDER = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi

// https://github.com/jquery/jquery/blob/master/src/manipulation/wrapMapMapMap.js
const wrapMap = {
  option: [1, '<select multiple="multiple">', '</select>'],
  thead: [1, '<table>', '</table>'],
  col: [2, '<table><colgroup>', '</colgroup></table>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  _default: [0, '', '']
}
wrapMap.optgroup = wrapMap.option
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead
wrapMap.th = wrapMap.td

export default function fragment (html, context) {
  if (typeof html !== 'string') {
    return []
  }

  if (!context) {
    if (support.createHTMLDocument) {
      context = document.implementation.createHTMLDocument('')

      const base = context.createElement('base')
      base.href = document.location.href
      context.head.appendChild(base)
    } else {
      context = document
    }
  }

  // Single tag match
  if (RE_SINGLETAG.test(html)) {
    return [context.createElement(RegExp.$1)]
  }

  // Use `innerHTML` to parse html fragment
  const nodes = []
  let fragment = context.createDocumentFragment()
  let tmp = fragment.appendChild(context.createElement('div'))

  // Deserialize a standard representation
  const tag = (RE_TAGNAME.exec(html) || ['', ''])[1].toLowerCase()
  const wrap = wrapMap[tag] || wrapMap._default
  tmp.innerHTML = `${wrap[1]}${html.replace && html.replace(RE_TAGEXPANDER, '<$1></$2>')}${wrap[2]}`

  // Exclude wrap elements
  let i = wrap[0]
  while (i--) {
    tmp = tmp.lastChild
  }

  // Add elements to result
  const children = tmp.childNodes
  for (let i = 0; i < children.length; i++) {
    nodes.push(children[i])
  }

  return nodes
}

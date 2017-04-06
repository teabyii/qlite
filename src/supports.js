const support = {}

// https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createHTMLDocument
const body = document.implementation.createHTMLDocument('').body
body.innerHTML = '<form></form><form></form>'
support.createHTMLDocument = body.childNodes.length === 2

export default support

import assert from 'assert'
import { default as q } from '../src/index'
const document = window.document

describe('Entry', () => {
  it('properties', () => {
    const a = q()
    assert(a.QLite === true)

    const b = q('div')
    assert(b.selector === 'div')
  })

  it('array behavior', () => {
    const a = q()

    assert.equal(typeof a.forEach, 'function')
    assert.equal(typeof a.map, 'function')
  })

  it('node', () => {
    const re = document.getElementsByTagName('body')
    const a = q(re)
    const b = q(re[0])

    assert.equal(a[0].tagName, 'BODY')
    assert.equal(b[0].tagName, 'BODY')
  })

  it('fragment', () => {
    const div = q('<div>hello</div>')
    assert.equal(div[0].innerText, 'hello')
  })

  it('function', () => {
    const doc = q(() => {
      // nothing
    })

    assert.equal(doc[0].nodeType, 9)
  })
})

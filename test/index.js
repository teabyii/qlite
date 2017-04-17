import assert from 'assert'
import { default as q } from '../index'
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

  it('ready', (done) => {
    const doc = q(() => {
      assert.ok(true)
      assert.equal(q('body')[0].tagName, 'BODY')
      done()
    })

    assert.equal(document, doc[0])
  })

  it('fn', () => {
    q.fn.a = true
    const a = q()
    assert(a.a)
    q.fn.a = undefined
  })

  it('extend', () => {
    q.fn.extend({ a: 1 })
    const a = q()
    assert.equal(a.a, 1)
    delete q.fn.a
  })
})

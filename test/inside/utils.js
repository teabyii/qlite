import assert from 'assert'
import { isGoodNode, attach, access } from '../../src/utils'
import { win } from '../../src/variables'

describe('Utils', () => {
  it('node', () => {
    assert(!isGoodNode())
  })

  it('attach', () => {
    const doc = win.document
    const data = attach(doc)
    assert.equal(typeof data, 'object')
    assert.equal(attach(doc), data)

    attach(doc, 'a', 1)
    assert.equal(attach(doc, 'a'), 1)
  })

  it('access', () => {
    const foo = [0, 1, 2].map(item => ({ test: item + 1 }))

    // Get
    assert.equal(
      access(foo, (item, key) => item[key] + key, 'test'),
      '1test'
    )

    // Set
    const target = access(foo, (item, key, value) => (item[key] = value), 'test', 2)
    assert.equal(target.length, 3)
    assert.equal(target[1].test, 2)
  })

  it('access by callback', () => {
    const foo = [0, 1, 2].map(item => ({ test: item + 1 }))

    let i = 0
    const target = access(foo, (item, key, value) => (item[key] = value), 'test', () => ++i)
    assert.equal(target[1].test, 2)
  })

  it('access no key', () => {
    const foo = [0, 1, 2].map(item => ({ test: item + 1 }))

    let target = access(
      foo,
      item => (item.foo = 2),
      false,
      item => (item.test + 1)
    )

    assert.equal(target[0].test, 1)
    assert.equal(target[0].foo, 2)

    target = access(
      foo,
      (foo, value) => {
        foo.forEach(item => {
          delete item.foo
          item.bar = value
        })
      },
      false,
      2
    )

    assert.equal(target[0].foo, undefined)
    assert.equal(target[0].bar, 2)
  })

  it('access multi key', () => {
    const foo = [0, 1, 2].map(item => ({
      foo: item + 1,
      bar: item + 2
    }))

    const target = access(foo, (item, key, value) => (item[key] = value), {
      foo: 2,
      bar: 3
    })

    assert.equal(target[0].foo, 2)
  })

  it('access empty', () => {
    const foo = []

    assert.equal(access(foo, (item, key) => item[key], 'test'), undefined)
  })
})

import assert from 'assert'
import {
  isGoodNode, uniq,
  attach, access,
  camelCase
} from '../../src/core/utils'

describe('Utils', () => {
  it('node', () => {
    assert(!isGoodNode())
  })

  it('uniq', () => {
    const a = [1, 2, 3, 1, 3, 4]
    assert.deepEqual(uniq(a), [1, 2, 3, 4])
  })

  it('attach', () => {
    const doc = window.document
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

  it('camelCase', () => {
    const cases = {
      'foo-bar': 'fooBar',
      'foo-bar-baz': 'fooBarBaz',
      'girl-u-want': 'girlUWant',
      'the-4th-dimension': 'the-4thDimension',
      '-o-tannenbaum': 'OTannenbaum',
      '-moz-illa': 'MozIlla',
      '-ms-take': 'msTake'
    }

    for (let key in cases) {
      assert.equal(camelCase(key), cases[key])
    }
  })
})

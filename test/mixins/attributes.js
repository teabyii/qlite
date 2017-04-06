import assert from 'assert'
import { inject, clear } from '../fixtures/inject'
import { default as q } from '../../src/index'

describe('Attributes', () => {
  before(() => {
    inject('elements')
  })

  it('get', () => {
    const foo = q('#foo')

    assert.equal(foo.attr('class'), 'foo')
    assert.equal(foo.attr('id'), 'foo')
  })

  it('set', () => {
    const foo = q('#foo')

    foo.attr('data-id', '1')
    assert.equal(foo[0].getAttribute('data-id'), '1')
    foo[0].removeAttribute('data-id')
  })

  it('remove', () => {
    const foo = q('#foo')

    foo.removeAttr('id')
    assert.equal(foo[0].getAttribute('id'), null)
    foo[0].setAttribute('id', 'foo')
  })

  it('remove multi', () => {
    const foo = q('#foo')

    foo.removeAttr('id class')
    assert.equal(foo[0].getAttribute('id'), null)
    assert.equal(foo[0].getAttribute('class'), null)

    foo[0].setAttribute('id', 'foo')
    foo[0].setAttribute('class', 'foo')
  })

  it('form', () => {
    const form = q('#form')
    assert.equal(form.attr('action'), 'index.html')

    const input = q('#form > input')
    assert.equal(input.attr('name'), 'bar')

    const options = q('#form option')
    assert.equal(options.attr('value'), '0')
  })

  after(() => {
    clear()
  })
})

import assert from 'assert'
import { inject, clear } from '../fixtures/inject'
import '../../src/mixins/properties'
import { default as q } from '../../src/index'

describe('Properties', () => {
  before(() => {
    inject('elements')
  })

  after(() => {
    clear()
  })

  it('get', () => {
    const radio = q('#radio')

    assert.equal(radio.prop('checked'), true)
    assert.equal(radio.prop('tagName'), 'INPUT')
  })

  it('set', () => {
    const radio = q('#radio + input')

    assert.equal(radio.prop('checked'), false)
    radio.prop('checked', true)
    assert.equal(radio.prop('checked'), true)
    radio.prop('checked', false)
  })

  it('remove', () => {
    const radio = q('#radio')

    radio.prop('code', '123')
    assert.equal(radio.prop('code'), '123')
    radio.removeProp('code')
    assert.equal(radio.prop('code'), undefined)
  })

  it('val', () => {
    const input = q('[name="input"]')
    assert.equal(input.val(), 'foo')
    input.val('bar')
    assert.equal(input.val(), 'bar')
  })

  it('select', () => {
    const select = q('#select')
    assert.equal(select.val(), '0')
    select.val('1')
    assert.equal(select.val(), '1')
  })

  it('mutiple select', () => {
    const select = q('#select-multi')
    assert.deepEqual(select.val(), ['0'])
    select.val(['0', '1'])
    assert.deepEqual(select.val(), ['0', '1'])
  })

  it('disabled select', () => {
    const select = q('#select-disabled')
    assert.equal(select.val(), '0')
  })

  it('disabled optgroup', () => {
    const select = q('#select-optgroup')
    assert.deepEqual(select.val(), ['1.1'])
    select.val(['3.1', '2.1'])
    assert.deepEqual(select.val(), ['1.1', '2.1'])
  })
})

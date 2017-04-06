import assert from 'assert'
import { inject, clear } from '../fixtures/inject'
import { default as q } from '../../src/index'

describe('Classname', () => {
  before(() => {
    inject('query')
  })

  after(() => {
    clear()
  })

  it('hasClass', () => {
    assert(q('.list').hasClass('list'))
    assert(q('.list > li').hasClass('list-item'))
  })

  it('addClass', () => {
    const foo = q('#foo')
    foo.addClass('test')

    assert.equal(foo[0].classList, 'test')
    foo[0].classList.remove('test')
  })

  it('add nothing', () => {
    const foo = q('#foo')
    foo.addClass()

    assert.equal(foo[0].classList, '')
  })

  it('multi add', () => {
    const items = q('.list > li')
    items.addClass('test')

    assert.equal(items[1].classList, 'list-item test')
    items.forEach(item => {
      item.classList.remove('test')
    })
  })

  it('add callback', () => {
    const ths = q('table th')
    ths.addClass(index => `count-${index + 1}`)

    assert.equal(ths[1].classList, 'count-2')
    ths.forEach((th, index) => {
      th.classList.remove(`count-${index + 1}`)
    })
  })

  it('removeClass', () => {
    const items = q('.list > li')
    items.removeClass('list-item')

    assert.equal(items[1].classList, '')
    items.forEach(item => {
      item.classList.add('list-item')
    })
  })

  it('remove callback', () => {
    const items = q('.bar')

    items.forEach((item, index) => {
      item.classList.add(`test-${index}`)
    })

    items.removeClass(index => `test-${index}`)
    assert.equal(items[1].classList, 'bar')
  })

  it('remove all', () => {
    const items = q('.list > li')

    items.forEach((item, index) => `test-${index}`)
    items.removeClass()

    assert.equal(items[1].classList, '')
    items.forEach(item => item.classList.add('list-item'))
  })

  it('remove nothing', () => {
    const list = q('.list')
    list.removeClass(false)

    assert.equal(list[0].classList, 'list')
  })

  it('toggleClass', () => {
    const list = q('.list')

    list.toggleClass('test', true)
    assert.equal(list[0].classList, 'list test')

    list.toggleClass('test', false)
    assert.equal(list[0].classList, 'list')
  })

  it('multi toggle', () => {
    const items = q('.bar')
    items.toggleClass('bar', false)
    assert.equal(items[1].classList, '')
    items.toggleClass('bar', true)
  })

  it('toggle no state', () => {
    const items = q('.bar')
    items.toggleClass('bar')
    assert.equal(items[1].classList, '')
    items.toggleClass('bar')
    assert.equal(items[1].classList, 'bar')
  })

  it('toggle callback', () => {
    const items = q('.list > li')
    items.toggleClass(index => `test-${index}`)
    assert.equal(items[1].classList, 'list-item test-1')
    items.toggleClass(index => `test-${index}`)
    assert.equal(items[0].classList, 'list-item')
  })

  it('toggle all', () => {
    const list = q('.list')
    list[0].classList.add('test')

    list.toggleClass()
    assert.equal(list[0].classList, '')
    list.toggleClass()
    assert.equal(list[0].classList, 'list test')

    list[0].classList.remove('test')
  })

  it('callback args', () => {
    const items = q('.list-item')
    let i = 0

    items.addClass((index, classname) => {
      assert.equal(index, i)
      assert.equal(classname, 'list-item')
      i++
    })

    i = 0
    items.removeClass((index, classname) => {
      assert.equal(index, i)
      assert.equal(classname, 'list-item')
      i++
    })

    i = 0
    items.toggleClass((index, classname) => {
      assert.equal(index, i)
      assert.equal(classname, '')
      i++
    })

    items.forEach(item => {
      item.classList.add('list-item')
    })
  })
})

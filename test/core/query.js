import assert from 'assert'
import { inject, clear } from '../fixtures/inject'
import query from '../../src/core/query'

describe('Query', () => {
  before(() => {
    inject('query')
  })

  after(() => {
    clear()
  })

  const collection = {
    id: {
      simple: ['#foo', 1, 'DIV', 'foo'],
      escaped: ['#foo\\:bar', 1, 'DIV', 'foo:bar'],
      underscore: ['#foo_bar', 1, 'DIV', 'foo_bar'],
      dash: ['#foo-bar', 1, 'DIV', 'foo-bar']
    },

    classname: {
      simple: ['.foo', 2, 'DIV', 'foo'],
      multi: ['.bar', 2, 'LI', '1']
    },

    tagname: {
      simple: ['h5', 1, 'H5', 'h5']
    },

    name: {
      simple: ['input[name=foo]', 1, 'INPUT']
    },

    comma: {
      'form & input': ['form[id=form], input[name=bar]', 2, 'FORM']
    },

    attributes: {
      link: ['[href="qlite"]', 1, 'A', 'qlite'],
      value: ['option[value="1"]', 1, 'OPTION', '1']
    },

    children: {
      list: ['ol.list > li', 3, 'LI', '1']
    },

    siblings: {
      simple: ['.foo + ul > li', 2, 'LI', '1']
    }
  }

  for (let key in collection) {
    const cases = collection[key]

    it(key, () => {
      for (let name in cases) {
        // selector, count, tagName, text
        const re = cases[name]
        const elems = query(re[0])
        assert.equal(elems.length, re[1])
        assert.equal(elems[0].tagName, re[2])
        if (re[3]) {
          assert.equal(elems[0].innerText, re[3])
        }
      }
    })
  }

  it('context', () => {
    const context = document.getElementById('form')

    assert.equal(query('#foo-input', context).length, 1)
    assert.equal(query('.foo', [context])[0].innerText, 'context')
  })

  it('empty', () => {
    assert.equal(query().length, 0)
  })

  it('exceptions', () => {

  })
})

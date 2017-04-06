import assert from 'assert'
import fragment from '../../src/manipulation/fragment'
import support from '../../src/supports'

describe('Fragment', () => {
  it('simple', () => {
    const list = fragment('<ol><li>1</li><li>2</li></ol>')
    const ol = list[0]

    assert.equal(ol.tagName, 'OL')
    assert.equal(ol.childNodes.length, 2)
  })

  it('empty', () => {
    assert.equal(fragment().length, 0)
  })

  it('single', () => {
    const img = fragment('<img />')
    assert.equal(img[0].tagName, 'IMG')
  })

  it('comment', () => {
    const div = fragment('<!-- comment --><div></div>')
    assert.equal(div[1].tagName, 'DIV')
  })

  it('special', () => {
    const th = fragment('<th>test</th>')
    assert.equal(th[0].innerText, 'test')
  })

  it('createHTMLDocument', () => {
    const backup = support.createHTMLDocument
    support.createHTMLDocument = false

    const list = fragment('<ul><li></li></ul>')
    assert.equal(list[0].tagName, 'UL')

    support.createHTMLDocument = backup
  })
})

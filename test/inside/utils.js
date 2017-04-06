import assert from 'assert'
import { isGoodNode, attach } from '../../src/utils'
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
})

import assert from 'assert'
import {
  win,
  isGoodNode,
  attach
} from '../../src/utils'

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

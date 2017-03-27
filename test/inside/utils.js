import assert from 'assert'
import { isGoodNode } from '../../src/utils'

describe('Utils', () => {
  it('node', () => {
    assert(!isGoodNode())
  })
})

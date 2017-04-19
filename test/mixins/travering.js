import assert from 'assert'
import { inject, clear } from '../fixtures/inject'
import '../../src/mixins/traversing'
import { default as q } from '../../src/index'

describe('Traversing', () => {
  before(() => {
    inject('query')
  })

  after(() => {
    clear()
  })

  it('is', () => {
    assert(q('#form').is('form'))
    assert(!q('#form').is('div'))
    assert(q('#foo-input').is('[type="text"]'))
    assert(q('[name="bar"]').is('[checked]'))
    assert(q('.list').is('.list, .list-item'))
    assert(q('.list').is(q('.list')[0]))
    assert(q('.list').is(q('.list')))
  })

  it('not', () => {
    const items = q('.bar, .list-item').not('.list-item')
    assert.equal(items.length, 2)
    assert(items[0].classList.contains('bar'))
  })

  it('add', () => {
    const items = q('.bar').add('.list-item')
    assert.equal(items.length, 5)
    assert(items[4].classList.contains('list-item'))
  })

  it('parent', () => {
    assert.equal(q('#foo-input').parent()[0].id, 'form')
    assert.equal(q('#foo-input').parent('div').length, 0)
    assert.equal(q('#foo-input').parent('div, form').length, 1)
    assert.equal(q('#foo-input').parent('div, form').length, 1)
  })

  it('parents', () => {
    assert.equal(q('#foo-input').parents()[0].id, 'form')
    const parents = q('.list span').parents();
    assert.equal(parents[0].tagName, 'LI')
    assert.equal(parents[1].tagName, 'OL')
    assert.equal(parents[2].tagName, 'DIV')
    assert.equal(parents[3].tagName, 'BODY')
  })

  it('parentsUntil', () => {
    const parents = q('.list span').parentsUntil('div');
    assert.equal(parents[0].tagName, 'LI')
    assert.equal(parents[1].tagName, 'OL')
    assert.equal(parents[2].tagName, 'LI')
    assert.equal(parents.length, 6);
  })

  it('closest', () => {
    assert.equal(q('body').closest()[0], q('body')[0])
    assert.equal(q('body').closest('html')[0], q('html')[0])
    assert.equal(q('body').closest('div').length, 0)
    assert.deepEqual(q('.list span').closest('li')[0], q('.list > li')[0])
  })

  it('next', () => {
    const items = q('.list-item')
    let nexts = items.next();
    assert.equal(nexts[0], items[1]);
    assert.equal(nexts[1], items[2]);
    assert.equal(nexts.length, 2);

    nexts = items.next('li');
    assert.equal(nexts[0], items[1]);

    nexts = items.next('div');
    assert.equal(nexts.length, 0);
  })

  it('nextAll', () => {
    const items = q('.list-item')
    let nexts = items.nextAll();
    assert.equal(nexts[0], items[1]);
    assert.equal(nexts[1], items[2]);
    assert.equal(nexts[2], items[2]);
    assert.equal(nexts.length, 3)

    nexts = items.nextAll('li');
    assert.equal(nexts[0], items[1]);

    nexts = items.nextAll('div');
    assert.equal(nexts.length, 0);
  })

  it('nextUntil', () => {
    const form = q('#form')
    let nexts = form.nextUntil('table')
    assert.equal(nexts[0].tagName, 'A');
    assert.equal(nexts[1].tagName, 'OL');
    assert.equal(nexts.length, 2);
  })

  it('prev', () => {
    const items = q('.list-item')
    let prevs = items.prev();
    assert.equal(prevs[0], items[0]);
    assert.equal(prevs[1], items[1]);
    assert.equal(prevs.length, 2);

    prevs = items.prev('li');
    assert.equal(prevs[1], items[1]);

    prevs = items.prev('div');
    assert.equal(prevs.length, 0);
  })

  it('prevAll', () => {
    const items = q('.list-item')
    let prevs = items.prevAll();
    assert.equal(prevs[0], items[0]);
    assert.equal(prevs[1], items[1]);
    assert.equal(prevs[2], items[0]);
    assert.equal(prevs.length, 3);

    prevs = items.prevAll('li');
    assert.equal(prevs[2], items[0]);

    prevs = items.prevAll('div');
    assert.equal(prevs.length, 0);
  })

  it('prevUntil', () => {
    const table = q('#table')
    let prevs = table.prevUntil('form')
    assert.equal(prevs[0].tagName, 'OL');
    assert.equal(prevs[1].tagName, 'A');
    assert.equal(prevs.length, 2);
  })

  it('siblings', () => {
    const foo = q('#foo-input')
    let siblings = foo.siblings()
    assert.equal(siblings.length, 3)
    assert.equal(siblings[0].tagName, 'INPUT')
    assert.equal(siblings[1].tagName, 'SELECT')

    siblings = foo.siblings('select')
    assert.equal(siblings.length, 1)
  })

  it('children', () => {
    const items = q('.list').children()
    assert.equal(items.length, 3)
    assert.equal(items[0].tagName, 'LI')

    const spans = items.children()
    assert.equal(spans.length, 3)
    assert.equal(spans[0].innerText, '1')
  })

  it('contents', () => {
     const contents = q('#content').contents()
     assert.equal(contents.not('br').length, 3)
  })
})

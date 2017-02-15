/* globals it, describe, before, beforeEach, expect, chai, sinonChai, sinon, fixture */
/* eslint no-unused-expressions: 0 */

import pinchit from '../../src/';

let element;

describe('pinchit()', () => {
  before(() => {
    fixture.setBase('test');
  });

  beforeEach(() => {
    sinon.spy(console, 'warn');
    fixture.load('test.html');
    element = fixture.el.querySelector('.wrapper');
  });

  afterEach(() => {
    console.warn.restore();
  });

  it('has to be a function', () => {
    expect(typeof pinchit).to.eql('function');
  });

  it('has to return an object', () => {
    expect(typeof pinchit('img')).to.eql('object');
  });

  describe('.setup()', () => {
    it('has to be a function', () => {
      const pinch = pinchit('img');
      expect(typeof pinch.setup).to.eql('function');
    });

    it('allows to pass a string as first argument', () => {
      pinchit('img');
      expect(console.warn).not.to.have.been.called;
    });

    it('allows to pass an node as first argument', () => {
      const node = element.querySelector('img');
      pinchit(node);
      expect(console.warn).not.to.have.been.called;
    });

    it('otherwise it should warn', () => {
      pinchit();
      expect(console.warn).to.have.been.called;
    });
  });

  describe('.reset()', () => {
    it('has to be a function', () => {});
  });

  describe('.destroy()', () => {
    it('has to be a function', () => {});
  });
});

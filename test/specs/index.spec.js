/* globals it, describe, before, beforeEach, expect, chai, sinonChai, sinon, fixture */
/* eslint no-unused-expressions: 0 */

import pinchit from '../../src/';
import {exportProps, touchEvent, createPinch} from './utils';

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
      pinchit(element);
      expect(console.warn).not.to.have.been.called;
    });

    it('otherwise it should warn', () => {
      pinchit();
      expect(console.warn).to.have.been.called;
    });
  });

  describe('methods', () => {
    it('should exist', () => {
      const pinch = pinchit(element);
      expect(typeof pinch.setup).to.eql('function');
      expect(typeof pinch.destroy).to.eql('function');
      expect(typeof pinch.reset).to.eql('function');
    });
  });

  describe('.reset()', () => {
    it('should be able to reset', (done) => {
      const pinch = pinchit(element);
      const basePinch = createPinch(element, 0.5, 0.5);
      touchEvent('touchstart', element, 500, basePinch(20))
      .then(() => touchEvent('touchmove', element, 200, basePinch(21)))
      .then(() => touchEvent('touchmove', element, 200, basePinch(30)))
      .then(() => {
        const {translate, scale} = exportProps(pinch.element);
        expect(translate).not.to.deep.eql([0, 0]);
        expect(scale).not.to.deep.eql([1, 1, 1]);
      })
      .then(() => touchEvent('touchend', element, 500, basePinch(30)))
      .then(() => {
        pinch.reset();
        const {translate, scale} = exportProps(pinch.element);
        expect(translate).to.deep.eql([0, 0]);
        expect(scale).to.deep.eql([1, 1, 1]);
        done();
      });
    });
  });

  describe('.destroy()', () => {
    it('should be able to destroy', () => {
      const pinch = pinchit(element);
      pinch.destroy();
      const {translate, scale} = exportProps(pinch.element);
      expect(translate).to.deep.eql([0, 0]);
      expect(scale).to.deep.eql([1, 1, 1]);
    });

    it('should be able to destroy and reset to base zoom and offset', (done) => {
      const pinch = pinchit(element);
      const basePinch = createPinch(element, 0.5, 0.5);
      touchEvent('touchstart', element, 500, basePinch(20))
      .then(() => touchEvent('touchmove', element, 200, basePinch(21)))
      .then(() => touchEvent('touchmove', element, 200, basePinch(30)))
      .then(() => {
        const {translate, scale} = exportProps(pinch.element);
        console.log(translate, scale);
        expect(translate).not.to.deep.eql([0, 0]);
        expect(scale).not.to.deep.eql([1, 1, 1]);
      })
      .then(() => touchEvent('touchend', element, 500, basePinch(30)))
      .then(() => {
        pinch.destroy();
        const {translate, scale} = exportProps(pinch.element);
        expect(translate).to.deep.eql([0, 0]);
        expect(scale).to.deep.eql([1, 1, 1]);
        done();
      });
    });
  });
});

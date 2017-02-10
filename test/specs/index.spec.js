/* globals it, describe, before, beforeEach, expect, sinon */
import pinchit from '../../src/';
let spy;

describe('pinchit()', () => {
  beforeEach(function() {
    sinon.spy(console, 'warn');
  });

  afterEach(function() {
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
      const pinch = pinchit('img');
      expect(console.warn).not.to.have.been.called;
    });

    it('allows to pass an node as first argument', () => {
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

  describe('pinch', () => {
    describe('onTouchstart', () => {
      it('pinchit should set style to element', () => {});
      it('pinchit should fire events', () => {});
    });

    describe('onTouchmove', () => {
      it('pinchit should set style to element', () => {});
      it('pinchit should fire events', () => {});
    });

    describe('onTouchend', () => {
      it('pinchit should set style to element', () => {});
      it('should return if smaller then min value', () => {});
      it('should return if smaller then max value', () => {});
      it('pinchit should fire events', () => {});
    });
  });
});

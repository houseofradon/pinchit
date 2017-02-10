/* globals it, describe, before, beforeEach, expect, sinon, fixture */

import pinchit from '../../src/';

let element;

const executeGesture = (el, cb) => {
  let event;
  let touches;
  touches = [
    { pageX: 0, pageY: 10, identifier: 0, target: el },
    { pageX: 10, pageY: 10, identifier: 1, target: el }
  ];

  event = document.createEvent('Event');
  event.initEvent('touchstart', true, true);
  event.touches = touches;
  event.targetTouches = touches;
  event.changedTouches = touches;
  el.dispatchEvent(event);
  setTimeout(() => {
    touches = [
      { pageX: 10, pageY: 20, identifier: 0, target: el },
      { pageX: 20, pageY: 20, identifier: 1, target: el }
    ];

    event = document.createEvent('Event');
    event.initEvent('touchmove', true, true);
    event.touches = touches;
    event.targetTouches = touches;
    event.changedTouches = touches;

    el.dispatchEvent(event);
  }, 100);

  setTimeout(() => {
    touches = [
      { pageX: 20, pageY: 30, identifier: 0, target: el },
      { pageX: 40, pageY: 30, identifier: 1, target: el }
    ];

    event = document.createEvent('Event');
    event.initEvent('touchmove', true, true);
    event.touches = touches;
    event.targetTouches = touches;
    event.changedTouches = touches;
    el.dispatchEvent(event);

    event = document.createEvent('Event');
    event.initEvent('touchend', true, true);
    event.touches = touches;
    event.targetTouches = touches;
    event.changedTouches = touches;
    el.dispatchEvent(event);
    cb();
  }, 200);
};

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

  describe('pinch', () => {
    describe('onTouchstart', () => {
      it('pinchit should set style to element', (done) => {
        const node = element.querySelector('img');
        pinchit(node);
        executeGesture(node, () => {
          expect(true).to.eql(true);
          done()
        });
      });
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

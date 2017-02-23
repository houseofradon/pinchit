/* globals it, describe, before, beforeEach, expect, chai, sinonChai, sinon, fixture */
/* eslint no-unused-expressions: 0 */

import pinchit from '../../src/';

let element;
const coordSequence = [
  [
    { pageX: 0, pageY: 10},
    { pageX: 10, pageY: 10}
  ],
  [
    { pageX: 10, pageY: 20},
    { pageX: 20, pageY: 20}
  ],
  [
    { pageX: 20, pageY: 30},
    { pageX: 40, pageY: 30}
  ]
];

const touchEvent = (eventType, el, timeout, coords) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = document.createEvent('Event');
      const touches = coords.map((coord, i) => Object.assign(coord, {
        target: el,
        identifier: i,
      }));

      event.initEvent(eventType, true, true);
      event.touches = touches;
      event.targetTouches = touches;
      event.changedTouches = touches;
      el.dispatchEvent(event);
      resolve(el);
    }, timeout);
  });
};

describe('touch pinch events', () => {
  before(() => {
    fixture.setBase('test');
  });

  beforeEach(() => {
    fixture.load('test.html');
    element = fixture.el.querySelector('.wrapper');
  });

  describe('pinch', () => {
    describe('onTouchstart', () => {
      it('pinchit should set style to element', (done) => {
        pinchit(element);
        touchEvent('touchstart', element, 0, coordSequence[0])
        .then(() => touchEvent('touchmove', element, 100, coordSequence[1]))
        .then(() => touchEvent('touchmove', element, 200, coordSequence[2]))
        .then(() => touchEvent('touchend', element, 0, coordSequence[2]))
        .then(() => {
          console.log(element.style);
          console.log('done');
          done();
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

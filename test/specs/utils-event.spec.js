/* globals it, describe, before, beforeEach, expect, sinon, fixture */

import { calcScale } from '../../src/utils/handle-event';

let element;

const mochGesture = () => {
  const firstTouch = [
    { x: 0, y: 10, pageX: 0, pageY: 10 },
    { x: 10, y: 10, pageX: 10, pageY: 10 }
  ];

  const secondTouch = [
    { x: 10, y: 20, pageX: 10, pageY: 20 },
    { x: 20, y: 20, pageX: 20, pageY: 20 }
  ];

  const thirdTouch = [
    { x: 20, y: 30, pageX: 20, pageY: 30 },
    { x: 40, y: 30, pageX: 40, pageY: 30 }
  ];

  return {
    firstTouch,
    secondTouch,
    thirdTouch,
  };
};

describe('pinch helpers', () => {
  before(() => {
    fixture.setBase('test');
  });

  beforeEach(() => {
    fixture.load('test.html');
    element = fixture.el.querySelector('.wrapper');
  });

  describe('calcScale()', () => {
    it('has to be a function', () => {
      expect(typeof calcScale).to.eql('function');
    });

    it('should return scale number between two touch points', () => {
      const { firstTouch } = mochGesture();
      expect(calcScale(element, firstTouch, firstTouch)).to.eql(1);
    });

    it('should return scale number between two touch points', () => {
      const { firstTouch, secondTouch } = mochGesture();
      expect(calcScale(element, firstTouch, secondTouch)).to.eql(1);
    });

    it('should return scale number between two touch points', () => {
      const { firstTouch, thirdTouch } = mochGesture();
      expect(calcScale(element, firstTouch, thirdTouch)).to.eql(2);
    });
  });
})

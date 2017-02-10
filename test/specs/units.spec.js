/* globals it, describe, before, beforeEach, expect, sinon, fixture */

import {calcDist, isWithin, calcScale} from '../../src/utils/pinch';

const mochGesture = () => {
  const firstTouch = [
    { pageX: 0, pageY: 10 },
    { pageX: 10, pageY: 10 }
  ];

  const secondTouch = [
    { pageX: 10, pageY: 20 },
    { pageX: 20, pageY: 20 }
  ];

  const thirdTouch = [
    { pageX: 20, pageY: 30 },
    { pageX: 40, pageY: 30 }
  ];

  return {
    firstTouch,
    secondTouch,
    thirdTouch,
  };
};

describe('pinch helpers', () => {
  it('isWithin has to return an function', () => {
    expect(typeof isWithin).to.eql('function');
  });

  it('calcScale has to return an function', () => {
    expect(typeof calcScale).to.eql('function');
  });

  describe('calcDist()', () => {
    const { firstTouch, secondTouch, thirdTouch } = mochGesture();
    it('has to be a function', () => {
      expect(typeof calcDist).to.eql('function');
    });

    it('should take a touch array and return a number based on pythagorean theorem', () => {
    });
  });
});

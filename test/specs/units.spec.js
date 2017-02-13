/* globals it, describe, before, beforeEach, expect, sinon, fixture */

import {calcDist, isWithin, calcScale, getScale, calcNewScale} from '../../src/utils/pinch';

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
  describe('calcDist()', () => {
    const { firstTouch, secondTouch, thirdTouch } = mochGesture();
    it('has to be a function', () => {
      expect(typeof calcDist).to.eql('function');
    });

    it('should take a touch array and return a number based on pythagorean theorem', () => {
      expect(calcDist(firstTouch)).to.eql(10);
    });

    it('should take a touch array and return a number based on pythagorean theorem', () => {
      expect(calcDist(secondTouch)).to.eql(10);
    });
  });

  describe('isWithin()', () => {
    it('has to be a function', () => {
      expect(typeof isWithin).to.eql('function');
    });

    it('should say that 20 is between 10 and 40', () => {
      expect(isWithin(20, {maxScale: 40, minScale: 10})).to.eql(true);
    });

    it('should say that 20 is not between 21 and 40', () => {
      expect(isWithin(20, {maxScale: 40, minScale: 21})).to.eql(false);
    });

    it('should say that 20 is not between 10 19', () => {
      expect(isWithin(20, {maxScale: 19, minScale: 10})).to.eql(false);
    });
  });

  describe('calcScale()', () => {
    it('has to be a function', () => {
      expect(typeof calcScale).to.eql('function');
    });
  })
});

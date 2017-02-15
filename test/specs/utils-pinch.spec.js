/* globals it, describe, before, beforeEach, expect, sinon, fixture */

import { isWithin, getOffset, getParentX, getParentY, getInitialScale, scaleFactor, getTouchCenter, calcScale, calcNewScale } from '../../src/utils/handle-pinch';
import defaults from '../../src/defaults';

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

  describe('isWithin()', () => {
    it('has to be a function', () => {
      expect(typeof getOffset).to.eql('function');
    });

    it('should return combined offsets', () => {
      const oldOffset = { x: 10, y: 20 };
      const newOffset = { x: 20, y: 10 };
      const combinedOffset = { x: 30, y: 30 };
      expect(getOffset(oldOffset, newOffset)).to.deep.eql(combinedOffset);
    });
  });

  describe('getParentX()', () => {
    it('has to be a function', () => {
      expect(typeof getParentX).to.eql('function');
    });

    it('should return parent x offsetWidth', () => {
      const img = element.querySelector('img');
      expect(getParentX(img)).to.eql(200);
    });
  });

  describe('getParentY()', () => {
    it('has to be a function', () => {
      expect(typeof getParentY).to.eql('function');
    });

    it('should return parent x offsetWidth', () => {
      const img = element.querySelector('img');
      expect(getParentY(img)).to.eql(100);
    });
  });

  describe('getInitialScale()', () => {
    it('has to be a function', () => {
      expect(typeof getInitialScale).to.eql('function');
    });

    it('should return 1 if parent node and parent node is the same', () => {
      const img = element.querySelector('img');
      expect(getInitialScale(img)).to.eql(1);
    });

    it('should return 1 if we cant find element', () => {
      expect(getInitialScale()).to.eql(1);
    });
  });

  describe('scaleFactor()', () => {
    it('has to be a function', () => {
      expect(typeof scaleFactor).to.eql('function');
    });

    it('should return a new scale and and a new zoomFactor', () => {
      const output = { zoomFactor: 6, scale: 2 };
      expect(scaleFactor(2, 3, defaults)).to.deep.eql(output);
    });

    it('should return a new scale and and a new zoomFactor', () => {
      const output = { zoomFactor: 1, scale: 1 };
      expect(scaleFactor(1, 1, defaults)).to.deep.eql(output);
    });
  });

  describe('getTouchCenter()', () => {
    it('has to be a function', () => {
      expect(typeof getTouchCenter).to.eql('function');
    });

    it('should return a new touch center', () => {
      const { firstTouch } = mochGesture();
      const output = { x: 5, y: 10 };
      expect(getTouchCenter(firstTouch)).to.eql(output);
    });

    it('should return a new touch center', () => {
      const { secondTouch } = mochGesture();
      const output = { x: 15, y: 20 };
      expect(getTouchCenter(secondTouch)).to.eql(output);
    });

    it('should return a new touch center', () => {
      const { thirdTouch } = mochGesture();
      const output = { x: 30, y: 30 };
      expect(getTouchCenter(thirdTouch)).to.eql(output);
    });
  });

  describe('calcScale()', () => {
    it('has to be a function', () => {
      expect(typeof calcScale).to.eql('function');
    });

    it('should return scale number between two touch points', () => {
      const { firstTouch } = mochGesture();
      expect(calcScale(firstTouch, firstTouch)).to.eql(1);
    });

    it('should return scale number between two touch points', () => {
      const { firstTouch, secondTouch } = mochGesture();
      expect(calcScale(firstTouch, secondTouch)).to.eql(1);
    });

    it('should return scale number between two touch points', () => {
      const { firstTouch, thirdTouch } = mochGesture();
      expect(calcScale(firstTouch, thirdTouch)).to.eql(2);
    });
  });

  describe('calcNewScale()', () => {
    it('has to be a function', () => {
      expect(typeof calcNewScale).to.eql('function');
    });

    it('should return scale number between two touch points', () => {
      expect(calcNewScale(4, 2)).to.eql(2);
    });
  });
});

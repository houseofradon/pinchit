/* globals it, describe, before, beforeEach, expect, chai, sinonChai, sinon, fixture */
/* eslint no-unused-expressions: 0 */

import pinchit from '../../src/';
import opts from '../../src/defaults';
import { getTouches, calcScale, getDistance } from '../../src/utils/handle-event';
import { getTouchCenter, calcNewScale, getScaleFactor, getZoomFactor, addOffset } from '../../src/utils/handle-pinch';
import { drag } from '../../src/utils/handle-drag';

import {exportProps, touchEvent, createPinch} from './utils';

let element;
let img;

describe('touch pinch events', () => {
  before(() => {
    fixture.setBase('test');
  });

  beforeEach(() => {
    fixture.load('test.html');
    element = fixture.el.querySelector('.wrapper');
    img = fixture.el.querySelector('.wrapper img');
  });

  describe('touchCenter', () => {
    // should always find the center between two fingers relative to the size
    // of the container in px

    it('should calculate distance between two fingers when points has base 0.5', () => {
      const basePinch = createPinch(element, 0.5, 0.5);
      const touchCenter = getTouchCenter(getTouches(element, Array.from(basePinch(10))));
      expect(touchCenter).to.deep.eql({x: 100, y: 50});
    });

    it('should calculate distance between two fingers when points has base 0.5', () => {
      const basePinch = createPinch(element, 0.4, 0.4);
      const touchCenter = getTouchCenter(getTouches(element, Array.from(basePinch(10))));
      expect(touchCenter).to.deep.eql({x: 80, y: 40});
    });
  });

  describe('getDistance', () => {
    it('get distance between two points in px', () => {
      const basePinch = createPinch(element, 0.5, 0.5);
      const newDistance = getDistance(getTouches(element, basePinch(10)));
      expect(newDistance).to.deep.eql(20);
    });

    it('get distance between two points in px', () => {
      const basePinch = createPinch(element, 0.5, 0.5);
      const newDistance = getDistance(getTouches(element, basePinch(15)));
      expect(newDistance).to.deep.eql(30);
    });
  });

  describe('newScale', () => {
    // Set scale between original touch center and new touch center
    // Calculate distance between first touch (two finger in px) divided
    // with current touch  (two finger in px)
    // formula
    // (40) / (20)

    it('should calculate distance between two fingers when points has base 0.5', () => {
      const basePinch = createPinch(element, 0.5, 0.5);
      const newScale = calcScale(element, basePinch(10), Array.from(basePinch(20)));
      expect(newScale).to.eql(2);
    });

    it('should calculate distance between two fingers when points has base 0.5', () => {
      const basePinch = createPinch(element, 0.5, 0.5);
      const newScale = calcScale(element, basePinch(10), Array.from(basePinch(30)));
      expect(newScale).to.eql(3);
    });

    it('should calculate distance between two fingers when points has base 0.5', () => {
      const basePinch = createPinch(element, 0.5, 0.5);
      const newScale = calcScale(element, basePinch(10), Array.from(basePinch(40)));
      expect(newScale).to.eql(4);
    });

    it('should calculate distance between two fingers when points has base 0.5', () => {
      const basePinch = createPinch(element, 0.5, 0.5);
      const newScale = calcScale(element, basePinch(20), Array.from(basePinch(40)));
      expect(newScale).to.eql(2);
    });
  });

  describe('scaleValue', () => {
    // calculate the diffrence between last scale and new scale
    it('should calculate a new scale', () => {
      const basePinch = createPinch(element, 0.5, 0.5);
      const firstScale = calcScale(element, basePinch(20), Array.from(basePinch(40)));
      const nextScale = calcScale(element, basePinch(20), Array.from(basePinch(80)));
      const newScale = calcNewScale(nextScale, firstScale);
      // (80 / 40) -> 2
      // (160 / 40) -> 4
      // 4 / 2 -> 2
      expect(newScale).to.eql(2);
    });

    it('should calculate a new scale', () => {
      const basePinch = createPinch(element, 0.5, 0.5);
      const firstScale = calcScale(element, basePinch(20), Array.from(basePinch(40)));
      const nextScale = calcScale(element, basePinch(20), Array.from(basePinch(42)));
      const newScale = calcNewScale(nextScale, firstScale);
      // (80 / 40) -> 2
      // (84 / 40) -> 2.1
      // 2.1 / 2 -> 1.05
      expect(newScale).to.eql(1.05);
    });
  });

  describe('scaleFactor', () => {
    //
    it('should calculate a new scale', () => {
      const basePinch = createPinch(element, 0.5, 0.5);
      const firstScale = calcScale(element, basePinch(20), Array.from(basePinch(40)));
      const nextScale = calcScale(element, basePinch(20), Array.from(basePinch(80)));
      const newScale = calcNewScale(nextScale, firstScale);
      const scale = getScaleFactor(newScale, 1, opts);
      expect(scale).to.eql(2);
    });

    it('should calculate a new scale if we go beond maxscale', () => {
      const basePinch = createPinch(element, 0.5, 0.5);
      const firstScale = calcScale(element, basePinch(20), Array.from(basePinch(30)));
      const nextScale = calcScale(element, basePinch(20), Array.from(basePinch(120)));
      const newScale = calcNewScale(nextScale, firstScale);
      const scale = getScaleFactor(newScale, 1, opts);
      expect(scale).to.eql(4);
    });

    it('should calculate a new zoom', () => {
      const basePinch = createPinch(element, 0.5, 0.5);
      const firstScale = calcScale(element, basePinch(20), Array.from(basePinch(30)));
      const nextScale = calcScale(element, basePinch(20), Array.from(basePinch(120)));
      const newScale = calcNewScale(nextScale, firstScale);
      const zoom = getZoomFactor(newScale, 1, opts);
      expect(zoom).to.eql(4);
    });
  });

  describe('offset', () => {
    it('should calculate an offset', () => {
      const basePinch = createPinch(element, 0.5, 0.5);
      const firstTouch = basePinch(20);
      const offset = { x: 0, y: 0 };

      const lastScale = calcScale(element, firstTouch, Array.from(basePinch(30)));

      const touchCenter = getTouchCenter(getTouches(element, Array.from(basePinch(31))));
      const nextScale = calcScale(element, firstTouch, Array.from(basePinch(31)));
      const newScale = calcNewScale(nextScale, lastScale);
      const scale = getScaleFactor(newScale, 1, opts);

      const newOffset = addOffset(offset, {
        x: (scale - 1) * (touchCenter.x + offset.x),
        y: (scale - 1) * (touchCenter.y + offset.y)
      });
      // if we base our zoom from the center
      // (wrapper-width * zoom - wrapper-width) / 2
      // (100 * 1.0333333333333334 - 100) / 2
      expect(parseFloat(newOffset.x, 10)).to.deep.eql(parseFloat(3.3333333333333437, 10));
    });

    it('should calculate an offset with drag', () => {
      const basePinch = createPinch(element, 0.5, 0.5);
      const firstTouch = basePinch(20);
      const offset = { x: 0, y: 0 };

      const lastScale = calcScale(element, firstTouch, Array.from(basePinch(30)));

      const touchCenter = getTouchCenter(getTouches(element, Array.from(basePinch(31))));
      const nextScale = calcScale(element, firstTouch, Array.from(basePinch(31)));
      const newScale = calcNewScale(nextScale, lastScale);
      const scale = getScaleFactor(newScale, 1, opts);
      const zoom = getZoomFactor(newScale, 1, opts);

      let newOffset = addOffset(offset, {
        x: (scale - 1) * (touchCenter.x + offset.x),
        y: (scale - 1) * (touchCenter.y + offset.y)
      });
      // if we dont move our fingers, drag will not affect the current offset
      newOffset = drag(touchCenter, touchCenter, newOffset, zoom);
      // if we base our zoom from the center
      // (wrapper-width * zoom - wrapper-width) / 2
      // (100 * 1.0333333333333334 - 100) / 2
      expect(parseFloat(newOffset.x, 10)).to.deep.eql(parseFloat(3.3333333333333437, 10));
    });
  });

  describe('pinch', () => {
    it('pinchit should set style to element when zooming', (done) => {
      const pinch = pinchit(element);
      const basePinch = createPinch(element, 0.5, 0.5);
      touchEvent('touchstart', element, 100, basePinch(20))
      .then(() => touchEvent('touchmove', element, 100, basePinch(21)))
      .then(() => touchEvent('touchmove', element, 100, basePinch(41)))
      .then(() => touchEvent('touchend', element, 0, basePinch(41)))
      .then(() => {
        const {translate, scale} = exportProps(pinch.element);
        expect(translate).to.deep.eql([-105, -52.5]);
        expect(scale).to.deep.eql([2.05, 2.05, 1]);
        done();
      });
    });

    it('pinchit should set style to element when zooming', (done) => {
      const pinch = pinchit(element);
      const basePinch = createPinch(element, 0.5, 0.5);
      touchEvent('touchstart', element, 100, basePinch(20))
      .then(() => touchEvent('touchmove', element, 100, basePinch(40)))
      .then(() => touchEvent('touchmove', element, 100, basePinch(30)))
      .then(() => {
        // console.log('scale down');
        done();
      });
    });

    it('pinchit should set style to element and return to max if we pass it', (done) => {
      const pinch = pinchit(element);
      const basePinch = createPinch(element, 0.5, 0.5);
      touchEvent('touchstart', img, 100, basePinch(20))
      // .then(() => touchEvent('touchmove', element, 100, basePinch(21)))
      .then(() => touchEvent('touchmove', img, 100, basePinch(100)))
      .then(() => {
        // we should still be in center of the image but pinched in
        const {translate, scale} = exportProps(pinch.element);
        expect(img.getBoundingClientRect().width).to.deep.eql(element.getBoundingClientRect().width * scale[0]);
        expect(scale).to.deep.eql([4, 4, 1]);
        expect(translate).to.deep.eql([-300, -150]);
        expect(element.getBoundingClientRect().width).to.eql(200);
        expect(img.getBoundingClientRect().width).to.eql(800);
        return true;
      })
      .then(() => touchEvent('touchend', img, 100, basePinch(141)))
      .then(() => {
        setTimeout(() => {
          const {translate, scale} = exportProps(pinch.element);
          expect(scale).to.deep.eql([3, 3, 1]);
          expect(translate).to.deep.eql([-200, -100]);
          expect(element.getBoundingClientRect().width).to.eql(200);
          expect(img.getBoundingClientRect().width).to.eql(600);
          done();
        }, 440);
      });
    });

    it('pinchit should set style to element and return to max if we pass it', (done) => {
      const pinch = pinchit(element);
      const basePinch = createPinch(element, 0.5, 0.5);
      touchEvent('touchstart', img, 100, basePinch(20))
      // .then(() => touchEvent('touchmove', element, 100, basePinch(21)))
      .then(() => touchEvent('touchmove', img, 100, basePinch(100)))
      .then(() => {
        // we should still be in center of the image but pinched in
        const {translate, scale} = exportProps(pinch.element);
        expect(element.querySelector('img').getBoundingClientRect().width).to.deep.eql(element.getBoundingClientRect().width * scale[0]);
        expect(scale).to.deep.eql([4, 4, 1]);
        expect(translate).to.deep.eql([-300, -150]);
        expect(element.getBoundingClientRect().width).to.eql(200);
        expect(element.querySelector('img').getBoundingClientRect().width).to.eql(800);
        return true;
      })
      .then(() => touchEvent('touchend', img, 100, basePinch(141)))
      .then(() => {
        setTimeout(() => {
          const {translate, scale} = exportProps(pinch.element);
          expect(scale).to.deep.eql([3, 3, 1]);
          expect(translate).to.deep.eql([-200, -100]);
          expect(element.getBoundingClientRect().width).to.eql(200);
          expect(element.querySelector('img').getBoundingClientRect().width).to.eql(600);
          done();
        }, 440);
      });
    });

    it('pinchit should set style to element and return to min if we pass it', (done) => {
      const pinch = pinchit(element);
      const basePinch = createPinch(element, 0.5, 0.5);
      touchEvent('touchstart', img, 100, basePinch(60))
      .then(() => touchEvent('touchmove', img, 100, basePinch(10)))
      .then(() => touchEvent('touchend', img, 100, basePinch(10)))
      .then(() => {
        setTimeout(() => {
          const {translate, scale} = exportProps(pinch.element);
          expect(scale).to.deep.eql([1, 1, 1]);
          expect(translate).to.deep.eql([0, 0]);
          expect(element.getBoundingClientRect().width).to.eql(200);
          expect(element.querySelector('img').getBoundingClientRect().width).to.eql(200);
          done();
        }, 440);
      });
    });
  });
});

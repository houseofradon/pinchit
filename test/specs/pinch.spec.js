/* globals it, describe, before, beforeEach, expect, chai, sinonChai, sinon, fixture */
/* eslint no-unused-expressions: 0 */

import pinchit from '../../src/';
import {exportProps, touchEvent, createPinch} from './utils';

let element;

describe('touch pinch events', () => {
  before(() => {
    fixture.setBase('test');
  });

  beforeEach(() => {
    fixture.load('test.html');
    element = fixture.el.querySelector('.wrapper');
  });

  describe('pinch', () => {
    it('pinchit should set style to element', (done) => {
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

    it('pinchit should set style to element and return to max if we pass it', (done) => {
      const pinch = pinchit(element);
      const basePinch = createPinch(element, 0.5, 0.5);
      touchEvent('touchstart', element, 100, basePinch(20))
      .then(() => touchEvent('touchmove', element, 100, basePinch(21)))
      .then(() => touchEvent('touchmove', element, 100, basePinch(141)))
      .then(() => touchEvent('touchend', element, 0, basePinch(141)))
      .then(() => {
        const {translate, scale} = exportProps(pinch.element);
        expect(scale).to.deep.eql([3, 3, 1]);
        done();
      });
    });
  });
});

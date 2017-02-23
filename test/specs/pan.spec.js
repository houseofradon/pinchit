/* globals it, describe, before, beforeEach, expect, chai, sinonChai, sinon, fixture */
/* eslint no-unused-expressions: 0 */

import pinchit from '../../src/';
import {exportProps, touchEvent, createPinch} from './utils';

let element;

describe('touch events', () => {
  before(() => {
    fixture.setBase('test');
  });

  beforeEach(() => {
    fixture.load('test.html');
    element = fixture.el.querySelector('.wrapper');
  });

  describe('pan', () => {
    describe('onTouchstart', () => {
      it('pinchit should set style to element', (done) => {
        const pinch = pinchit(element);
        const basePinch = createPinch(element, 0.5, 0.5);
        touchEvent('touchstart', element, 0, basePinch(20))
        .then(() => touchEvent('touchmove', element, 0, basePinch(41)))
        .then(() => touchEvent('touchend', element, 0, basePinch(41)))
        .then(() => touchEvent('touchstart', element, 0, basePinch(41, true)))
        .then(() => touchEvent('touchmove', element, 0, basePinch(60, true)))
        .then(() => touchEvent('touchend', element, 0, basePinch(60, true)))
        .then(() => {
          const {translate, scale} = exportProps(pinch.element);
          console.log(translate, scale);
          // expect(translate).to.deep.eql([-105, -52.5]);
          expect(scale).to.deep.eql([2.05, 2.05, 1]);
          done();
        });
      });
    });
  });
});

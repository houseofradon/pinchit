/* globals it, describe, before, beforeEach, expect, chai, sinonChai, sinon, fixture */
/* eslint no-unused-expressions: 0 */

import pinchit from '../../src/';
import {touchEvent, createPinch} from './utils';

let element;
let pinch;

describe('events', () => {
  before(() => {
    fixture.setBase('test');
  });

  beforeEach(() => {
    fixture.load('test.html');
    element = fixture.el.querySelector('.wrapper');
  });

  describe('touchstart, touchmove, touchend', () => {
    beforeEach(() => {
      pinch = pinchit(element);
    });

    it('should fire touchstart event', (done) => {
      const basePinch = createPinch(element, 0.5, 0.5);
      // needs to be called before touchevent
      pinch.on('touchstart', () => done());
      touchEvent('touchstart', element, 100, basePinch(20));

    });

    it('should fire touchmove event', (done) => {
      const basePinch = createPinch(element, 0.5, 0.5);
      touchEvent('touchstart', element, 100, basePinch(20))
      .then(() => touchEvent('touchmove', element, 100, basePinch(21)));
      pinch.on('touchmove', () => done());
    });

    it('should fire touchend event', (done) => {
      const basePinch = createPinch(element, 0.5, 0.5);
      touchEvent('touchstart', element, 100, basePinch(20))
      .then(() => touchEvent('touchmove', element, 100, basePinch(21)))
      .then(() => touchEvent('touchend', element, 0, basePinch(22)));
      pinch.on('touchend', () => done());
    });
  });
});

// @flow

import detectPrefixes from './utils/detect-prefixes';
import dispatchEvent from './utils/dispatch-event';
import { isWithin, calcScale } from './utils/pinch';
import defaults from './defaults';


const pinchIt = (target, options = {}) => {
  // private variable cache
  let elements;
  let scaling;
  let firstTouch;
  let lastTouch;

  const prefixes = detectPrefixes();

 /**
  *  dispatchPinchEvent - Shorthand method for creating events
  *
  *  @param { String } phase
  *  @param { String } type
  *  @param { Object } details
  *  @return { void } false
  **/
  const dispatchPinchEvent = (phase: string, type: string): void => {
    dispatchEvent(elements, `${phase}.pinch.${type}`);
  };

 /**
  *  cancelEvent - Cancel Events so we dont bubble up our events to the document
  *
  *  @param { Object } event
  *  @return { void }
  **/
  const cancelEvent = (e: Event): void => {
    e.stopPropagation();
    e.preventDefault();
  };

  /**
   * scaleEl -translates to a given position in a given time in milliseconds
   *
   * @param { Object } element element from the events
   * @param { Number } number in pixels where to translate to
   * @param { Number } duration time in milliseconds for the transistion
   * @param { String } ease easing css property
   * @return { viud }
   */
  const scaleEl = (el, to: number, duration: number, ease: string): void => {
    const style = el && el.style;
    const { transition, transform, hasScale3d } = prefixes;
    if (!style) return;

    style[`${transition}TimingFunction`] = ease;
    style[`${transition}Duration`] = `${duration}ms`;
    style[transform] = (hasScale3d)
      ? `scale3d(${to}, ${to}, 1)`
      : `scale(${to}, ${to})`;
  };

  // event handling

  /**
   * Set scaling if we are using more then one finger
   * and captures our first punch point
   * private
   * @param { Object } e the event from our eventlistener
   */
  const onTouchstart = ({ease}) => (e: Event) => {
    scaling = (e.touches.length === 2);
    firstTouch = Array.from(e.touches);
    console.log(firstTouch);
    cancelEvent(e);
    // Disable aniamtion so we can pinch
    // Set our initial starting point for our pinch
    scaleEl(e.target, 1, 0, ease);

    dispatchPinchEvent('on', 'touchstart', {
      e
    });
  };

  const onTouchmove = ({ease}) => (e: Event) => {
    if (!scaling || !firstTouch) return;
    dispatchPinchEvent('before', 'touchmove');

    // dont bubble touch event
    cancelEvent(e);

    lastTouch = Array.from(e.touches);
    scaleEl(e.target, calcScale(firstTouch, lastTouch), 0, ease);

    dispatchPinchEvent('after', 'touchmove');
  };

  const onTouchend = opts => (e: Event) => {
    const scale = calcScale(firstTouch, lastTouch);

    firstTouch = null;
    lastTouch = null;

    if (!isWithin(scale, opts)) {
      scaleEl(e.target, 1, opts.snapBackSpeed, opts.ease);
    }
  };

  const attachEvents = opts => (el: Object) => {
    el.addEventListener('touchstart', onTouchstart(opts));
    el.addEventListener('touchmove', onTouchmove(opts));
    el.addEventListener('touchend', onTouchend(opts));
  };

  const detachhEvents = (el: Object) => {
    el.removeEventListener('touchstart', onTouchstart);
    el.removeEventListener('touchmove', onTouchmove);
    el.removeEventListener('touchend', onTouchend);
  };

  /**
   * public
   * reset function:
   * @param { Number } duration
   * @param { String } easing
   * @return { void }
   */
  const reset = (duration: number, easing: string): void => {
    Array.from(elements).forEach(el => scaleEl(el, 1, duration, easing));
  };

  /**
   * public
   * destroy function: called to gracefully destroy the lory instance
   * @return { void }
   */
  const destroy = (): void => {
    dispatchPinchEvent('before', 'destroy');
    // remove event listeners
    Array.from(elements).forEach(detachhEvents);
    dispatchPinchEvent('after', 'destroy');
  };

  /**
   * setup - Init function
   *
   * @param { String, Object }
   * @return { void }
   **/

  type Options = {
    maxPinch?: number;
    minPinch?: number;
    snapBackSpeed?: number;
    ease?: string;
  };

  const setup = (target: string, opt: Options): void => {
    if (elements) destroy();
    dispatchPinchEvent('before', 'init');

    // Base configuration for the pinch instance
    const opts = {...defaults, ...opt};

    // resolve target
    // pinchit allows for both a node or a string to be passed
    switch (typeof target) {
      case 'object':
        elements = Array.isArray(target) ? target : [target];
        break;
      case 'string':
        elements = document.querySelectorAll(target);
        break;
      default:
        elements = [];
        console.warn('missing target, either pass an node or a string');
    }

    Array.from(elements).forEach(attachEvents(opts));

    dispatchPinchEvent('after', 'init');
  };

  // trigger initial setup
  setup(target, options);

  return {
    setup,
    reset,
    destroy,
    elements,
  };
};

export default pinchIt;

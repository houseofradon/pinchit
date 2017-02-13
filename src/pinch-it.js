// @flow

import detectPrefixes from './utils/detect-prefixes';
import dispatchEvent from './utils/dispatch-event';
import { detectDoubleTap } from './utils/detect-event';
import { cancelEvent } from './utils/handle-events';

import { isWithin, calcScale, calcNewScale, getInitialScale } from './utils/pinch';
import defaults from './defaults';

const pinchIt = (targets: string | Object, options: Object = {}) => {
  // private variable cache
  let elements;
  let scaling;
  let lastScale;
  let firstTouch;
  let lastTouch;

  const prefixes = detectPrefixes();

 /**
  *  dispatchPinchEvent - Shorthand method for creating events
  *
  *  @param { String } phase
  *  @param { String } type
  *  @param { Object } details
  *  @return { Void }
  **/
  const dispatchPinchEvent = (phase: string, type: string): void => {
    dispatchEvent(elements, `${phase}.pinch.${type}`);
  };

  /**
   * scaleEl -translates to a given position in a given time in milliseconds
   *
   * @param { Object } element element from the events
   * @param { Number } number in pixels where to translate to
   * @param { Number } duration time in milliseconds for the transistion
   * @param { String } ease easing css property
   * @return { Void }
   */
  const scaleEl = (el: EventTarget, to: number, duration: number, ease: string): void => {
    const { transition, transform, hasScale3d } = prefixes;
    const { style } = el;
    // Base our new dimention on our prevous value minus our base value

    const scaleProp = (hasScale3d)
      ? `scale3d(${to}, ${to}, 1)`
      : `scale(${to}, ${to})`;

    style[`${transition}TimingFunction`] = ease;
    style[`${transition}Duration`] = `${duration}ms`;
    style[transform] = scaleProp;
  };

  // event handling
  /**
   * Set scaling if we are using more then one finger
   * and captures our first punch point
   *
   * private
   * @param { Object } e the event from our eventlistener
   */
  const onTouchstart = (/* opt */) => (e: TouchEvent) => {
    scaling = (e.touches.length === 2);
    firstTouch = Array.from(e.touches);

    cancelEvent(e);
    (detectDoubleTap(e)) ? console.log('true') : console.log('false');
    dispatchPinchEvent('on', 'touchstart', { e });
  };

  const onTouchmove = ({ease}) => (e: TouchEvent) => {
    if (!scaling || !firstTouch) return;
    dispatchPinchEvent('before', 'touchmove');

    // dont bubble touch event
    cancelEvent(e);

    lastTouch = Array.from(e.touches);
    const scale = calcNewScale(calcScale(firstTouch, lastTouch), lastScale);
    scaleEl(e.target, scale, 0, ease);

    dispatchPinchEvent('after', 'touchmove');
  };

  const onTouchend = opts => (e: TouchEvent) => {
    if (!firstTouch || !lastTouch) return;
    const scale = calcNewScale(calcScale(firstTouch, lastTouch), lastScale);

    lastScale = getInitialScale(e.target);
    firstTouch = null;
    lastTouch = null;

    if (!isWithin(scale, opts)) {
      const isLessThan = (scale < opts.minScale);
      lastScale = isLessThan ? opts.minScale : opts.maxScale;
      scaleEl(e.target, lastScale, opts.snapBackSpeed, opts.ease);
    }
  };

  const attachEvents = opts => (el: HTMLElement) => {
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
   * @return { Void }
   */
  const reset = (opt: Object) => (item: ?number): void => {
    const { snapBackSpeed, easing } = {...defaults, ...opt};

    if (item && !isNaN(item) && elements[item]) {
      scaleEl(elements[item], 1, snapBackSpeed, easing);
    } else {
      Array.from(elements).forEach(el => scaleEl(el, 1, snapBackSpeed, easing));
    }

    lastScale = 1;
    firstTouch = null;
    lastTouch = null;
  };

  /**
   * public
   * destroy function: called to gracefully destroy the lory instance
   * @return { Void }
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
   * @return { Void }
   **/

  type Options = {
    maxPinch?: number;
    minPinch?: number;
    snapBackSpeed?: number;
    ease?: string;
  };

  const setup = (target: string | Object, opt: Options): void => {
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
  setup(targets, options);

  return {
    setup,
    reset: reset(options),
    destroy,
    elements,
  };
};

export default pinchIt;

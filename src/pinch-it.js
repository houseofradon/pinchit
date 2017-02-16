// @flow
//
import eventDispatcher from './utils/dispatch-event';
import { cancelEvent, getTouches, detectDoubleTap } from './utils/handle-event';
import scaleElement from './utils/handle-element';
import { isWithin, calcScale, calcNewScale, addOffset, getInitialScale, scaleFactor, getTouchCenter } from './utils/handle-pinch';
import { drag, sanitizeOffset } from './utils/handle-drag';
import defaults from './defaults';

const first = (items: Array<Object>) => items[0];

const pinchIt = (targets: string | Object, options: Object = {}) => {
  // private variable cache
  let elements = [];

  let scaling;
  let lastScale = 1;
  let startTouches;

  let zoomFactor = 1;

  let offset = { x: 0, y: 0 };
  let lastZoomCenter = false;
  let lastDragPosition = false;

  const { on, dispatch } = eventDispatcher();

 /**
  *  dispatchPinchEvent - Shorthand method for creating events
  *
  *  @param { String } phase
  *  @param { String } type
  *  @param { Object } details
  *  @return { Void }
  **/
  const dispatchPinchEvent = (eventName: string, phase: string, data: Object = {}): void => {
    dispatch(eventName, Object.assign(data, {
      phase
    }));
  };

  const resetGlobals = (/* opts */): void => {
    scaling = undefined;
    lastScale = 1;
    startTouches = null;
    zoomFactor = 1;
    lastZoomCenter = false;

    lastDragPosition = false;
    offset = { x: 0, y: 0 };
  };

  // event handling
  /**
   * Set scaling if we are using more then one finger
   * and captures our first punch point
   *
   * private
   * @param { Object } e the event from our eventlistener
   */
  const onTouchstart = (opts: Object) => (e: TouchEvent) => {
    dispatchPinchEvent('touchstart', 'before', e);


    scaling = (e.touches.length === 2);
    startTouches = Array.from(e.touches);
    lastScale = 1;

    if (detectDoubleTap(e)) {
      scaleElement(e.target, 1, { x: 0, y: 0 }, opts.snapBackSpeed, opts.ease);
      resetGlobals();
    }

    dispatchPinchEvent('touchstart', 'after', e);
  };

  const onTouchmove = (opts: Object) => (e: TouchEvent) => {
    dispatchPinchEvent('touchmove', 'before', e);

    if ((!scaling || !startTouches) && zoomFactor > 1) {
      cancelEvent(e);

      const touch = first(getTouches(e.target, Array.from(e.touches)));
      const dragOffset = drag(touch, lastDragPosition, offset, zoomFactor);
      offset = sanitizeOffset(e.target, dragOffset, zoomFactor);
      lastDragPosition = touch;
    } else if (scaling && startTouches) {
      cancelEvent(e);

      // a relative scale factor is used
      const touchCenter = getTouchCenter(getTouches(e.target, Array.from(e.touches)));
      const newScale = calcScale(e.target, startTouches, Array.from(e.touches));
      const scale = calcNewScale(newScale, lastScale);

      const factor = scaleFactor(scale, zoomFactor, opts);


      offset = addOffset(offset, {
        x: (factor.scale - 1) * (touchCenter.x + offset.x),
        y: (factor.scale - 1) * (touchCenter.y + offset.y)
      });

      zoomFactor = factor.zoomFactor;
      lastScale = newScale;
      offset = drag(touchCenter, lastZoomCenter, offset, zoomFactor);
      lastZoomCenter = touchCenter;
    }

    scaleElement(e.target, zoomFactor, offset, 0, opts.ease);

    dispatchPinchEvent('touchmove', 'after', e);
  };

  const onTouchend = opts => (e: TouchEvent) => {
    dispatchPinchEvent('touchend', 'before', e);

    lastDragPosition = false;
    lastZoomCenter = false;
    lastScale = 1;

    if (zoomFactor) {
      if (!isWithin(zoomFactor, opts)) {
        const isLessThan = (getInitialScale(e.target) * zoomFactor < opts.minScale);
        zoomFactor = isLessThan ? opts.minScale : opts.maxScale;
        offset = sanitizeOffset(e.target, offset, zoomFactor);
        scaleElement(e.target, zoomFactor, offset, opts.snapBackSpeed, opts.ease);
      }
    }

    dispatchPinchEvent('touchend', 'after', e);
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
      scaleElement(elements[item], 1, { x: 0, y: 0 }, snapBackSpeed, easing);
    } else {
      Array.from(elements).forEach(el => (
        scaleElement(el, 1, { x: 0, y: 0 }, snapBackSpeed, easing))
      );
    }

    resetGlobals();
  };

  /**
   * public
   * destroy function: called to gracefully destroy the lory instance
   * @return { Void }
   */
  const destroy = (): void => {
    dispatchPinchEvent('destroy', 'before', {});
    // remove event listeners
    Array.from(elements).forEach(detachhEvents);
    elements = [];
    resetGlobals();
    dispatchPinchEvent('destroy', 'after', {});
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
    dispatchPinchEvent('init', 'before', {});

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

    dispatchPinchEvent('init', 'after', {});
  };

  // trigger initial setup
  setup(targets, options);

  return {
    setup,
    reset: reset(options),
    destroy,
    elements,
    on,
  };
};

export default pinchIt;

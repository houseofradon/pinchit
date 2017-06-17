// @flow
//
import eventDispatcher from './utils/dispatch-event';
import { cancelEvent, getTouches, detectDoubleTap, calcScale } from './utils/handle-event';
import scaleElement from './utils/handle-element';
import { isWithin, calcNewScale, addOffset, getInitialScale, getScaleFactor, getZoomFactor, getTouchCenter } from './utils/handle-pinch';
import { drag, sanitizeOffset } from './utils/handle-drag';
import defaults from './defaults';

const first = (items: Array<Object>) => items[0];

const setTarget = (el, opts) => (
  el.querySelector(opts.target ? `img${opts.target}` : 'img')
);

const pinchIt = (targets: string | Object, options: Object = {}) => {
  // private variable cache
  let element = null;

  let scaling;
  let lastScale = 1;
  let startTouches;

  let zoomFactor = 1;

  let offset = { x: 0, y: 0 };
  let lastZoomCenter: Object = {};
  let lastDragPosition: Object = {};

  // Base configuration for the pinch instance
  const opts = {...defaults, ...options};
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
    lastZoomCenter = {};
    lastDragPosition = {};
    offset = { x: 0, y: 0 };
  };

  /**
   * Set scaling if we are using more then one finger
   * and captures our first punch point
   *
   * private
   * @param { Object } e the event from our eventlistener
   */
  const onTouchstart = (e: TouchEvent) => {
    dispatchPinchEvent('touchstart', 'before', e);

    const { target, currentTarget } = e;

    scaling = (e.touches.length === 2);
    startTouches = Array.from(e.touches);
    lastScale = 1;

    if (detectDoubleTap(e) && target instanceof HTMLElement && currentTarget instanceof HTMLElement) {
      const image = currentTarget.querySelector('img');
      scaleElement(target, image, 1, { x: 0, y: 0 }, opts.snapBackSpeed, opts.ease);
      resetGlobals();
    }

    dispatchPinchEvent('touchstart', 'after', e);
  };

  const onTouchmove = (e: TouchEvent) => {
    dispatchPinchEvent('touchmove', 'before', e);

    const { currentTarget, target, touches } = e;

    if ((!scaling || !startTouches) && zoomFactor > 1) {
      cancelEvent(e);

      const touch = first(getTouches(currentTarget, Array.from(touches)));
      const dragOffset = drag(touch, lastDragPosition, offset, zoomFactor);

      offset = sanitizeOffset(target, dragOffset, zoomFactor);
      lastDragPosition = touch;
    } else if (scaling && startTouches) {
      cancelEvent(e);

      // a relative scale factor is used
      const touchCenter = getTouchCenter(getTouches(e.currentTarget, Array.from(touches)));
      const newScale = calcScale(e.currentTarget, startTouches, Array.from(touches));
      const scaleValue = calcNewScale(newScale, lastScale);
      const scale = getScaleFactor(scaleValue, zoomFactor, opts);

      zoomFactor = getZoomFactor(scaleValue, zoomFactor, opts);

      offset = addOffset(offset, {
        x: (scale - 1) * (touchCenter.x + offset.x),
        y: (scale - 1) * (touchCenter.y + offset.y)
      });

      lastScale = newScale;
      offset = drag(touchCenter, lastZoomCenter, offset, zoomFactor);
      lastZoomCenter = touchCenter;
    }

    if (target instanceof HTMLElement && currentTarget instanceof HTMLElement) {
      const image = currentTarget.querySelector('img');
      scaleElement(target, image, zoomFactor, offset, 0, opts.ease);
    }

    dispatchPinchEvent('touchmove', 'after', e);
  };

  const onTouchend = (e: TouchEvent) => {
    dispatchPinchEvent('touchend', 'before', e);

    const { target, currentTarget } = e;

    if (zoomFactor && !isWithin(zoomFactor, opts) && currentTarget instanceof HTMLElement) {
      const image = currentTarget.querySelector('img');
      const isLessThan = (getInitialScale(target, image) * zoomFactor < opts.minScale);
      const lastZoom = zoomFactor;
      zoomFactor = isLessThan ? opts.minScale : opts.maxScale;
      const scaleValue = calcNewScale(zoomFactor, lastZoom);
      const scale = getScaleFactor(scaleValue, zoomFactor, opts);
      offset = addOffset(offset, {
        x: (scale - 1) * (lastZoomCenter.x + offset.x),
        y: (scale - 1) * (lastZoomCenter.y + offset.y)
      });
      offset = sanitizeOffset(e.target, offset, zoomFactor);
      scaleElement(target, image, zoomFactor, offset, opts.snapBackSpeed, opts.ease);
    }

    lastScale = 1;
    lastDragPosition = {};
    lastZoomCenter = {};

    dispatchPinchEvent('touchend', 'after', e);
  };

  const attachEvents = (el: HTMLElement) => {
    el.addEventListener('touchstart', onTouchstart);
    el.addEventListener('touchmove', onTouchmove);
    el.addEventListener('touchend', onTouchend);
  };

  const detachhEvents = (el: HTMLElement) => {
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
  const reset = (opt: Object = {}): void => {
    if (!element) return;
    const image = setTarget(element, opts);
    if (!image) return;
    const { snapBackSpeed, easing } = Object.assign({}, opts, opt);
    scaleElement(element, image, 1, { x: 0, y: 0 }, snapBackSpeed, easing);
    resetGlobals();
  };

  /**
   * public
   * destroy function: called to gracefully destroy the lory instance
   * @return { Void }
   */
  const destroy = (opt: Object = {}): void => {
    dispatchPinchEvent('destroy', 'before', {});
    if (!element) return;
    reset(opt);
    // remove event listeners
    detachhEvents(element);
    element = null;
    resetGlobals();
    dispatchPinchEvent('destroy', 'after', {});
  };

  /**
   * setup - Init function
   *
   * @param { String, Object }
   * @return { Void }
   **/
  const setup = (target: string | HTMLElement): void => {
    if (element) destroy();
    dispatchPinchEvent('init', 'before', {});
    // resolve target
    // pinchit allows for both a node or a string to be passed
    switch (typeof target) {
      case 'object':
        element = target;
        break;
      case 'string':
        element = document.querySelector(target);
        break;
      default:
        element = null;
        console.warn('missing target, either pass an node or a string');
    }

    if (element) {
      attachEvents(element);
    }

    dispatchPinchEvent('init', 'after', {});
  };

  // trigger initial setup
  setup(targets);

  return {
    setup,
    reset,
    destroy,
    element,
    on,
  };
};

export default pinchIt;

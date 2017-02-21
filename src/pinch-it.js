// @flow
//
import eventDispatcher from './utils/dispatch-event';
import { cancelEvent, getTouches, detectDoubleTap, calcScale } from './utils/handle-event';
import scaleElement from './utils/handle-element';
import { isWithin, calcNewScale, addOffset, getInitialScale, getScaleFactor, getZoomFactor, getTouchCenter } from './utils/handle-pinch';
import { drag, sanitizeOffset } from './utils/handle-drag';
import defaults from './defaults';

const first = (items: Array<Object>) => items[0];

const pinchIt = (targets: string | Object, options: Object = {}) => {
  // private variable cache
  let element = null;

  let scaling;
  let lastScale = 1;
  let startTouches;

  let zoomFactor = 1;

  let offset = { x: 0, y: 0 };
  let lastZoomCenter = false;
  let lastDragPosition = false;

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
  const onTouchstart = (e: TouchEvent) => {
    dispatchPinchEvent('touchstart', 'before', e);


    scaling = (e.touches.length === 2);
    startTouches = Array.from(e.touches);
    lastScale = 1;

    if (detectDoubleTap(e)) {
      const image = e.currentTarget.querySelector('img');
      scaleElement(e.target, image, 1, { x: 0, y: 0 }, opts.snapBackSpeed, opts.ease);
      resetGlobals();
    }

    dispatchPinchEvent('touchstart', 'after', e);
  };

  const onTouchmove = (e: TouchEvent) => {
    dispatchPinchEvent('touchmove', 'before', e);

    if ((!scaling || !startTouches) && zoomFactor > 1) {
      cancelEvent(e);

      const touch = first(getTouches(e.currentTarget, Array.from(e.touches)));
      const dragOffset = drag(touch, lastDragPosition, offset, zoomFactor);

      offset = sanitizeOffset(e.target, dragOffset, zoomFactor);
      lastDragPosition = touch;
    } else if (scaling && startTouches) {
      cancelEvent(e);

      // a relative scale factor is used
      const touchCenter = getTouchCenter(getTouches(e.currentTarget, Array.from(e.touches)));
      const newScale = calcScale(e.currentTarget, startTouches, Array.from(e.touches));
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

    const image = e.currentTarget.querySelector('img');
    scaleElement(e.target, image, zoomFactor, offset, 0, opts.ease);

    dispatchPinchEvent('touchmove', 'after', e);
  };

  const onTouchend = (e: TouchEvent) => {
    dispatchPinchEvent('touchend', 'before', e);

    lastDragPosition = false;
    lastZoomCenter = false;
    lastScale = 1;
    if (zoomFactor) {
      if (!isWithin(zoomFactor, opts)) {
        const image = e.currentTarget.querySelector('img');
        const isLessThan = (getInitialScale(e.target, image) * zoomFactor < opts.minScale);
        zoomFactor = isLessThan ? opts.minScale : opts.maxScale;
        offset = sanitizeOffset(e.target, offset, zoomFactor);
        scaleElement(e.target, image, zoomFactor, offset, opts.snapBackSpeed, opts.ease);
      }
    }

    dispatchPinchEvent('touchend', 'after', e);
  };

  const attachEvents = (el: HTMLElement) => {
    el.addEventListener('touchstart', onTouchstart);
    el.addEventListener('touchmove', onTouchmove);
    el.addEventListener('touchend', onTouchend);
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
  const reset = (): void => {
    if (!element) return;
    const { snapBackSpeed, easing } = opts;
    scaleElement(element, 1, { x: 0, y: 0 }, snapBackSpeed, easing);
    resetGlobals();
  };

  /**
   * public
   * destroy function: called to gracefully destroy the lory instance
   * @return { Void }
   */
  const destroy = (): void => {
    dispatchPinchEvent('destroy', 'before', {});
    if (!element) return;
    reset();
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
  const setup = (target: string | Object): void => {
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
      console.log(element);
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

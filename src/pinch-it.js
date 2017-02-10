import detectPrefixes from './utils/detect-prefixes';
import dispatchEvent from './utils/dispatch-event';
import defaults from './defaults';

const pinchIt = (target, options = {}) => {
  // private variable cache
  let elements;
  let scaling;
  let firstTouch;
  let prefixes;

  const dispatchPinchEvent = (phase, type, detail) => {
    dispatchEvent(elements, `${phase}.pinch.${type}`, detail);
  };

  /*
  *  Cancel Events so we dont bubble up our events to the document
  */
  const cancelEvent = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  /**
   * Pythagorean theorem:
   * Calculate the distance between our fingers
   * @param touces - Array of each value from Touchlist
   * @return Number
   *
   **/
  const calcDist = (touches) => {
    const [first, second] = touches;
    return Math.sqrt(
      ((first.pageX - second.pageX) * (first.pageX - second.pageX)) +
      ((first.pageY - second.pageY) * (first.pageY - second.pageY))
    );
  };

  /**
   * Calculate the distance between where we start our pinch
   * to where we end it
   */
  const calcScale = (startTouch, endTouch) => (
    calcDist(endTouch) / calcDist(startTouch)
  );

  /**
   * translates to a given position in a given time in milliseconds
   *
   * @to        {number} number in pixels where to translate to
   * @duration  {number} time in milliseconds for the transistion
   * @ease      {string} easing css property
   */
  const scaleElem = (element, to, duration, ease) => {
    const style = element && element.style;
    const { transition, transform, hasScale3d } = prefixes;
    if (!style) return;

    style[`${transition}TimingFunction`] = ease;
    style[`${transition}Duration`] = `${duration}ms`;
    style[transform] = (hasScale3d)
      ? `scale3d(${to}, ${to}, 0)`
      : `scale(${to}, ${to})`;
  };

  /**
   * Set scaling if we are using more then one finger
   * and captures our first punch point
   */
  const onTouchstart = (e) => {
    scaling = (e.touches.length === 2);
    firstTouch = Array.from(e.touches);

    cancelEvent(e);
    // Disable aniamtion so we can pinch
    // Set our initial starting point for our pinch
    scaleElem(e.target, 1, 0, 'easing');

    dispatchPinchEvent('on', 'touchstart', {
      event
    });
  };

  const onTouchmove = (e) => {
    if (!scaling || !firstTouch) return;
    dispatchPinchEvent('before', 'touchmove');

    // dont bubble touch event
    cancelEvent(e);
    scaleElem(e.target, calcScale(firstTouch, Array.from(e.touches)), 0);

    dispatchPinchEvent('after', 'touchmove');
  };

  const onTouchend = (e) => {
    firstTouch = null;
    // 1. Enable aniamtion
    // 2. Calculate if we new scale is between max and min values
    // 3. Otherwise return to number and use the current easing
    scaleElem(e.target, 1, 300, 'easing');
  };

  const attachEvents = (el) => {
    el.addEventListener('touchstart', onTouchstart);
    el.addEventListener('touchmove', onTouchmove);
    el.addEventListener('touchend', onTouchend);
  };

  const detachhEvents = (el) => {
    el.removeEventListener('touchstart', onTouchstart);
    el.removeEventListener('touchmove', onTouchmove);
    el.removeEventListener('touchend', onTouchend);
  };

  const setup = (target, options) => {
    dispatchPinchEvent('before', 'init');

    // Base configuration for the pinch instance
    const opts = {...defaults, ...options};
    prefixes = detectPrefixes();

    // resolve target
    switch (typeof target) {
      case 'object':
        elements = target;
        break;
      case 'string':
        elements = document.querySelectorAll(target);
        break;
      default:
        console.warn('missing target, either pass an node or a string');
    }
    Array.from(elements).forEach(attachEvents);

    dispatchPinchEvent('after', 'init');
  };

  /**
   * public
   * reset function:
   */
  const reset = () => {

  };


  /**
   * public
   * destroy function: called to gracefully destroy the lory instance
   */
  const destroy = () => {
    dispatchPinchEvent('before', 'destroy');
    // remove event listeners
    Array.from(elements).forEach(detachhEvents);
    dispatchPinchEvent('after', 'destroy');
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

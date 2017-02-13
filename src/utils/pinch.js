// @flow

import detectPrefixes from './detect-prefixes';

const prefixes = detectPrefixes();

/**
 * Calculates the average of multiple vectors (x, y values)
 */
const getVectorAvg = (vectors) => {
  // return {
  //   x: vectors.map((v) => (v.x)).reduce(sum) / vectors.length,
  //   y: vectors.map(function (v) { return v.y; }).reduce(sum) / vectors.length
  // };
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
export const scaleEl = (el: EventTarget, to: number, duration: number, ease: string): void => {
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

/**
 * calcDist - Calculate the distance between our fingers
 *
 * @param { Array } touches touches passas an array from TouchList
 * @return { Number } the calcualted distance between the fingers
 **/
export const calcDist = (touches: Array<Object>): number => {
  const [first, second] = touches;
  return Math.sqrt(
    ((first.pageX - second.pageX) * (first.pageX - second.pageX)) +
    ((first.pageY - second.pageY) * (first.pageY - second.pageY))
  );
};

/**
isWithin - Check if value is between two values
 *
 * @param { Number } scale current scale value
 * @param { Object } minPinch, maxPinh
 * @return { Boolean }
 **/
export const isWithin = (scale: number, opts: Object): boolean => {
  const { maxScale, minScale } = opts;
  return (scale > minScale) && (scale < maxScale);
};

/**
 * getScale - Check if value is between two values
 *
 * @param { Node } el current scale value
 * @return { Number }
 **/
export const getInitialScale = el => (
  el.getBoundingClientRect().width / el.offsetWidth
);

/**
 * Scales the zoom factor relative to current state
 * @param scale
 * @return the actual scale (can differ because of max min zoom factor)
 */
export const scaleFactor = (scaleFactor, scale, opts) => {
  const originalZoomFactor = scaleFactor;
  let newScaleFactor = scaleFactor * scale;
  newScaleFactor = Math.min(opts.maxScale, Math.max(newScaleFactor, opts.minScale));
  return {
    newScaleFactor,
    originalZoomFactor,
  };
};

export const getTouchCenter = touches => getVectorAvg(touches);

/**
 * calcScale - Calculate the distance between where we start our pinch
 * to where we end it
 *
 * @param { Array } startTouch The starting point of our touch
 * @param { Array } endTouch The current point of our touch
 * @return { Number }
 */
export const calcScale = (startTouch: Array<Object>, endTouch: Array<Object>): number => (
  calcDist(endTouch) / calcDist(startTouch)
);

export const calcNewScale = (to: number, lastScale: number = 1) => (
  to + ((lastScale) - 1)
);

// @flow

import { calcDist, getTouches } from './handle-event';

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
export const getInitialScale = (el: EventTarget): number => (
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
  calcDist(getTouches(endTouch)) / calcDist(getTouches(startTouch))
);

export const calcNewScale = (to: number, lastScale: number = 1) => (
  to + ((lastScale) - 1)
);

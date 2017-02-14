// @flow

import { getDistance, getTouches } from './handle-event';

const sum = (acc, next) => acc + next;

/**
 * Calculates the average of multiple vectors (x, y values)
 */
const getVectorAvg = (vectors) => {
  return {
    x: vectors.map(v => (v.x)).reduce(sum) / vectors.length,
    y: vectors.map(v => (v.y)).reduce(sum) / vectors.length
  };
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
export const scaleFactor = (scale: number, factor: number, opts: Object) => {
  const originalFactor = factor;
  const zoomFactor = factor * scale;
  return {
    zoomFactor,
    scale: zoomFactor / originalFactor,
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
  getDistance(getTouches(endTouch)) / getDistance(getTouches(startTouch))
);

export const calcNewScale = (to: number, lastScale: number = 1) => (
  to / lastScale // + ((lastScale) - 1)
);

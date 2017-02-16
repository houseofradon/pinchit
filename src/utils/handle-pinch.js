// @flow

import { getDistance, getTouches } from './handle-event';

const sum = (acc, next) => acc + next;

/**
 * Calculates the average of multiple vectors (x, y values)
 */
const getVectorAvg = (vectors: Array<Object>): Object => ({
  x: vectors.map(v => (v.x)).reduce(sum) / vectors.length,
  y: vectors.map(v => (v.y)).reduce(sum) / vectors.length,
});

const getParentElement = (type: string) => (el: EventTarget): number => (
  (el instanceof HTMLImageElement && el.parentElement instanceof HTMLDivElement)
  ? el.parentElement[type]
  : 1
);

/**
 * isWithin - Check if value is between two values
 *
 * @param { Number } scale current scale value
 * @param { Object } minPinch, maxPinh
 * @return { Boolean }
 **/
export const isWithin = (scale: number, opts: Object): boolean => {
  const { maxScale, minScale } = opts;
  return (scale >= minScale) && (scale <= maxScale);
};

/**
 * addOffset - Combine current offset with old offset and returns a new offset
 *
 * @param { Object } lastOffset last offset
 * @param { Object } offset, new offset
 * @return { Object }
 **/
export const addOffset = (lastOffset: Object, offset: Object): Object => ({
  x: lastOffset.x + offset.x,
  y: lastOffset.y + offset.y,
});

export const getParentX = getParentElement('offsetWidth');
export const getParentY = getParentElement('offsetHeight');

/**
 * getScale - Check if value is between two values
 *
 * @param { Node } el current scale value
 * @return { Number }
 **/
export const getInitialScale = (el: EventTarget): number => (
  (el instanceof HTMLImageElement)
  ? getParentX(el) / el.offsetWidth
  : 1
);

/**
 * Scales the zoom factor relative to current state
 *
 * @param scale
 * @return the actual scale (can differ because of max min zoom factor)
 */
export const scaleFactor = (scale: number, factor: number, opts: Object): Object => {
  const originalFactor = factor;
  let zoomFactor = factor * scale;
  const { maxScaleTimes, minScaleTimes } = opts;
  zoomFactor = Math.min(maxScaleTimes, Math.max(zoomFactor, minScaleTimes));
  return {
    zoomFactor,
    scale: zoomFactor / originalFactor,
  };
};

/**
 * Calculates the virtual zoom center for the current offset and zoom factor
 * (used for reverse zoom)
 * @return {Object} the current zoom center
 */
export const getCurrentPinchCenter = (el: EventTarget, zoomFactor: number, offset: Object): Object => {
  const length = getParentX(el) * zoomFactor;
  const offsetLeft = offset.x;
  const offsetRight = length - offsetLeft - getParentX(el);
  const widthOffsetRatio = offsetLeft / offsetRight;
  let centerX = (widthOffsetRatio * getParentX(el)) / (widthOffsetRatio + 1);

  // the same for the zoomcenter y
  const height = getParentY(el) * zoomFactor;
  const offsetTop = offset.y;
  const offsetBottom = height - offsetTop - getParentY(el);
  const heightOffsetRatio = offsetTop / offsetBottom;
  let centerY = (heightOffsetRatio * getParentY(el)) / (heightOffsetRatio + 1);

  // prevents division by zero
  if (offsetRight === 0) { centerX = getParentX(el); }
  if (offsetBottom === 0) { centerY = getParentY(el); }

  return {
    x: centerX,
    y: centerY,
  };
};

export const getTouchCenter = (touches: Array<Object>) => getVectorAvg(touches);

/**
 * calcScale - Calculate the distance between where we start our pinch
 * to where we end it
 *
 * @param { Array } startTouch The starting point of our touch
 * @param { Array } endTouch The current point of our touch
 * @return { Number }
 */
export const calcScale = (el: EventTarget, startTouch: Array<Object>, endTouch: Array<Object>): number => (
  getDistance(getTouches(el, endTouch)) / getDistance(getTouches(el, startTouch))
);

export const calcNewScale = (to: number, lastScale: number = 1): number => (
  to / lastScale
);

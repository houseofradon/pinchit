// @flow

const sum = (acc, next) => acc + next;

/**
 * Calculates the average of multiple vectors (x, y values)
 */
const getVectorAvg = (vectors: Array<Object>): Object => ({
  x: vectors.map(v => (v.x)).reduce(sum) / vectors.length,
  y: vectors.map(v => (v.y)).reduce(sum) / vectors.length,
});

const getElement = (type: string) => (el: EventTarget): number => (
  (el instanceof HTMLImageElement)
  ? el[type]
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

export const getX = getElement('offsetWidth');
export const getY = getElement('offsetHeight');

/**
 * getScale - Check if value is between two values
 *
 * @param { Node } el current scale value
 * @return { Number }
 **/
export const getInitialScale = (el: EventTarget, image: HTMLElement): number => (
  (el instanceof HTMLImageElement)
  ? getX(el) / image.offsetWidth
  : 1
);

/**
 * Scales the zoom factor relative to current state
 *
 * @param scale
 * @return the actual scale (can differ because of max min zoom factor)
 */
export const getScaleFactor = (scale: number, factor: number, opts: Object): Object => {
  const originalFactor = factor;
  let zoomFactor = factor * scale;
  const { maxScaleTimes, minScaleTimes } = opts;
  zoomFactor = Math.min(maxScaleTimes, Math.max(zoomFactor, minScaleTimes));
  return zoomFactor / originalFactor;
};

/**
 * Scales the zoom factor relative to current state
 *
 * @param scale
 * @return the actual scale (can differ because of max min zoom factor)
 */
export const getZoomFactor = (scale: number, factor: number, opts: Object): Object => {
  const { maxScaleTimes, minScaleTimes } = opts;
  return Math.min(maxScaleTimes, Math.max(factor * scale, minScaleTimes));
};

export const getTouchCenter = (touches: Array<Object>) => getVectorAvg(touches);

export const calcNewScale = (to: number, lastScale: number = 1): number => (
  to / lastScale
);

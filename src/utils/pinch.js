// @flow

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
export const getScale = el => (
  el.getBoundingClientRect().width / el.offsetWidth
);

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

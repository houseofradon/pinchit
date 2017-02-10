// @flow

/**
 * calcDist - Calculate the distance between our fingers
 *
 * @param { Array } touches touches passas an array from TouchList
 * @return { Number } the calcualted distance between the fingers
 *
 **/
export const calcDist = (touches): number => {
  const [first, second] = touches;
  return Math.sqrt(
    ((first.pageX - second.pageX) * (first.pageX - second.pageX)) +
    ((first.pageY - second.pageY) * (first.pageY - second.pageY))
  );
};

/**
 *
isWithin - Check if value is between two values
 *
 * @param { Number } scale current scale value
 * @param { Object } minPinch, maxPinh
 * @return { Boolean }
 *
 **/
export const isWithin = (scale: number, {minPinch, maxPinch}): boolean => {
  return (scale > minPinch) && (scale < maxPinch);
};

/**
 * calcScale - Calculate the distance between where we start our pinch
 * to where we end it
 *
 * @param { Array } startTouch The starting point of our touch
 * @param { Array } endTouch The current point of our touch
 * @return { Number }
 */
export const calcScale = (startTouch, endTouch): number => (
  calcDist(endTouch) / calcDist(startTouch)
);

// @flow

type TochPage = {
  pageX: number;
  pageY: number;
}

type Touch = {
  x: number;
  y: number;
};

/**
 *  cancelEvent - Cancel Events so we dont bubble up our events to the document
 *
 *  @param { Object } event
 *  @return { Void }
 **/
export const cancelEvent = (e: Event): void => {
  e.stopPropagation();
  e.preventDefault();
};

/**
 * Returns the touches of an event relative to the container offset
 * @param event
 * @return array touches
 */
export const getTouches = (touches: Array<TochPage>): Array<Touch> => {
  return touches.map(touch => ({
    x: touch.pageX,
    y: touch.pageY,
  }));
};

/**
 * getDistance - Calculate the distance between our fingers
 *
 * @param { Array } touches touches passas an array from TouchList
 * @return { Number } the calcualted distance between the fingers
 **/
export const getDistance = (touches: Array<Touch>): number => {
  const [first, second] = touches;
  return Math.sqrt(
    ((first.x - second.x) * (first.x - second.x)) +
    ((first.y - second.y) * (first.y - second.y))
  );
};

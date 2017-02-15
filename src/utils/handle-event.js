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
export const getTouches = (el, touches: Array<TochPage>): Array<Touch> => {
  const position = el.parentElement.getBoundingClientRect();
  return touches.map(touch => ({
    x: touch.pageX - (position.left + document.body.scrollLeft),
    y: touch.pageY - (position.top + document.body.scrollTop),
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

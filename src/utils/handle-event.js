// @flow

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
export const getTouches = (touche: TouchEvent, container) => {
  // const {left, top} = container.offset();
  return touches.map(touch => ({
    x: touch.pageX - 0, // left,
    y: touch.pageY - 0, // top
  }));
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
    ((first.x - second.x) * (first.x - second.x)) +
    ((first.y - second.y) * (first.y - second.y))
  );
};

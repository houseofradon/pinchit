// @flow
let lastTouchStart = 0;

type TochPage = {
  pageX: number;
  pageY: number;
}

type Touch = {
  x: number;
  y: number;
};

/**
 * cancelEvent - Cancel Events so we dont bubble up our events to the document
 *
 * @param { Object } event
 * @return { Void }
 **/
export const cancelEvent = (e: Event): void => {
  e.stopPropagation();
  e.preventDefault();
};

/**
 * detectDoubleTap - Check if we are double tapping
 *
 * @param { Object } event
 * @return { Boolean }
 **/
export const detectDoubleTap = (e: TouchEvent): boolean => {
  const time = (new Date()).getTime();

  if (e.touches.length > 1) {
    lastTouchStart = 0;
  }

  if (time - lastTouchStart < 300) {
    cancelEvent(e);
    return true;
  }

  if (e.touches.length === 1) {
    lastTouchStart = time;
  }
  return false;
};

/**
 * Returns the touches of an event relative to the container offset
 *
 * @param event
 * @return array touches
 */
export const getTouches = (el: EventTarget, touches: Array<TochPage>): Array<Touch> => {
  const position = el.getBoundingClientRect();
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

// @flow

import { cancelEvent } from './handle-event';

let lastTouchStart = 0;

export const detectDoubleTap = (e: TouchEvent): boolean => {
  const time = (new Date()).getTime();

  if (e.touches.length > 1) {
    lastTouchStart = 0;
  }

  if (time - lastTouchStart < 300) {
    cancelEvent(event);
    return true;
  }

  if (e.touches.length === 1) {
    lastTouchStart = time;
  }
  return false;
};

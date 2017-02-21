// @flow

import { getX, getY, addOffset } from './handle-pinch';

type Center = {
  x: number;
  y: number;
};

const calcMax = (el: EventTarget, differ: number, zoomFactor: number): Object => ({
  maxX: (zoomFactor - differ) * getX(el),
  maxY: (zoomFactor - differ) * getY(el),
});

export const sanitizeOffset = (el: EventTarget, offset: Center, zoomFactor: number): Object => {
  const { maxX, maxY } = calcMax(el, 1, zoomFactor);
  const maxOffsetX = Math.max(maxX, 0);
  const maxOffsetY = Math.max(maxY, 0);
  const minOffsetX = Math.min(maxX, 0);
  const minOffsetY = Math.min(maxY, 0);

  return {
    x: Math.min(Math.max(offset.x, minOffsetX), maxOffsetX),
    y: Math.min(Math.max(offset.y, minOffsetY), maxOffsetY)
  };
};

export const drag = (center: Center, lastCenter: Center, lastOffset: Object, zoomFactor: number): Object => (
  (Object.prototype.hasOwnProperty.call(lastCenter, 'x'))
  ? addOffset(lastOffset, {
    x: -(((center.x - lastCenter.x) * zoomFactor) / zoomFactor),
    y: -(((center.y - lastCenter.y) * zoomFactor) / zoomFactor),
  })
  : lastOffset
);

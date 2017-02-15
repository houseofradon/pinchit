// @flow

import { getParentX, getParentY } from './handle-pinch';

type Center = {
  x: number;
  y: number;
};

export const sanitizeOffset = (el: EventTarget, offset: Center, zoomFactor: number): Object => {
  const maxX = (zoomFactor - 1) * getParentX(el);
  const maxY = (zoomFactor - 1) * getParentY(el);
  const maxOffsetX = Math.max(maxX, 0);
  const maxOffsetY = Math.max(maxY, 0);
  const minOffsetX = Math.min(maxX, 0);
  const minOffsetY = Math.min(maxY, 0);

  return {
    x: Math.min(Math.max(offset.x, minOffsetX), maxOffsetX),
    y: Math.min(Math.max(offset.y, minOffsetY), maxOffsetY)
  };
};

export const drag = (center: Center, lastCenter: Center, lastOffset: Object) => (
  (lastCenter) ? {
    x: lastOffset.x + -(center.x - lastCenter.x),
    y: lastOffset.y + -(center.y - lastCenter.y)
  } : lastOffset
);

// @flow

type Center = {
  x: number;
  y: number;
};

export const drag = (center: Center, lastCenter: Center, lastOffset: Object) => (
  (lastCenter) ? {
    x: lastOffset.x + -(center.x - lastCenter.x),
    y: lastOffset.y + -(center.y - lastCenter.y)
  } : lastOffset
);

export const detectEdges = () => {}

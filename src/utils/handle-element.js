// @flow

import detectPrefixes from './detect-prefixes';
import { getInitialScale } from './handle-pinch';

const prefixes = detectPrefixes();

const extractTransform = (value: string, match: string): string => {
  const items = value.split(')');
  const foundItem = items.find(item => item.indexOf(match) > -1);
  return (foundItem) ? foundItem + ')' : '';
};

const handleAnimation = (el: EventTarget, transition: string, duration: number, ease: string) => {
  const { style } = el;
  style[`${transition}TimingFunction`] = ease;
  style[`${transition}Duration`] = `${duration}ms`;
};

export const scaleElement = (el: EventTarget, pinch: number, coords: Object, duration: number, ease: string): void => {

  const { transition, transform, hasScale3d } = prefixes;
  const { style } = el;

  const zoomFactor = getInitialScale(el) * pinch;
  const offsetX = -coords.x / zoomFactor;
  const offsetY = -coords.y / zoomFactor;

  handleAnimation(el, transition, duration, ease);
  const scaleProp = (hasScale3d)
    ? `scale3d(${zoomFactor}, ${zoomFactor}, 1)`
    : `scale(${zoomFactor}, ${zoomFactor})`;
  const translateProp = `translate(${offsetX}px, ${offsetY}px)`;

  style[transform] = `${translateProp} ${scaleProp}`;
};

/**
 * scaleEl -translates to a given position in a given time in milliseconds
 *
 * @param { Object } element element from the events
 * @param { Number } number in pixels where to translate to
 * @param { Number } duration time in milliseconds for the transistion
 * @param { String } ease easing css property
 * @return { Void }
 */
export const scaleEl = (el: EventTarget, to: number, duration: number, ease: string): void => {
  const { transition, transform, hasScale3d } = prefixes;
  const { style } = el;

  // Base our new dimention on our prevous value minus our base value
  handleAnimation(el, transition, duration, ease);

  const newZoom = to;
  const scaleProp = (hasScale3d)
    ? `scale3d(${newZoom}, ${newZoom}, 1)`
    : `scale(${newZoom}, ${newZoom})`;

  const translate = extractTransform(style[transform], 'translate');
  style[transform] = `${scaleProp} ${translate}`;
};

export const translateEl = (el: EventTarget, coords: Object, zoomFactor: number): void => {
  const { transform, hasScale3d } = prefixes;
  const { x, y } = coords;
  const { style } = el;

  const newZoomFactor = getInitialScale(el) * zoomFactor;

  const offsetX = -x / newZoomFactor;
  const offsetY = -y / newZoomFactor;

  const scale = extractTransform(style[transform], hasScale3d ? 'scale3d' : 'scale');
  style[transform] = `translate(${offsetX}px, ${offsetY}px) ${scale}`;
};

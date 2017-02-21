// @flow

import detectPrefixes from './detect-prefixes';
import { getInitialScale } from './handle-pinch';

const prefixes = detectPrefixes();

const handleAnimation = (el: HTMLElement, transition: string, duration: number, ease: string): void => {
  const { style } = el;
  style.transformOrigin = '0% 0%';
  style[`${transition}TimingFunction`] = ease;
  style[`${transition}Duration`] = `${duration}ms`;
};

/**
 * scaleElement -transdorms to a given position in a given time in milliseconds
 *
 * @param { Object } el element from the events
 * @param { Number } pinch number where to scale to
 * @param { Object } coords object where to translate to
 * @param { Number } duration time in milliseconds for the transistion
 * @param { String } ease easing css property
 * @return { Void }
 */

export default (el: HTMLElement, image: HTMLElement, pinch: number, coords: Object, duration: number, ease: string): void => {
  const { transition, transform, hasScale3d } = prefixes;
  const { style } = image;

  const zoomFactor = getInitialScale(el, image) * pinch;

  const offsetX = -coords.x;
  const offsetY = -coords.y;

  handleAnimation(image, transition, duration, ease);
  const scaleProp = (hasScale3d)
    ? `scale3d(${zoomFactor}, ${zoomFactor}, 1)`
    : `scale(${zoomFactor}, ${zoomFactor})`;
  const translateProp = `translate(${offsetX}px, ${offsetY}px)`;

  style[transform] = `${translateProp} ${scaleProp}`;
};

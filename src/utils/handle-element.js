// @flow

import detectPrefixes from './detect-prefixes';

const prefixes = detectPrefixes();

const handleAnimation = (el: EventTarget, transition: string, duration: number, ease: string) => {
  const { style } = el;
  style[`${transition}TimingFunction`] = ease;
  style[`${transition}Duration`] = `${duration}ms`;
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

  const scaleProp = (hasScale3d)
    ? `scale3d(${to}, ${to}, 1)`
    : `scale(${to}, ${to})`;
  style[transform] = scaleProp;
};

export const translateEl = (el: EventTarget, coords: Object): void => {
  const { transform } = prefixes;
  const { x, y } = coords;
  const { style } = el;

  style[transform] = `translate(${x}, ${y})`;
};

/**
 * Detecting prefixes for saving time and bytes
 */
export default () => {
  let transform;
  let transition;
  let transitionEnd;
  let hasScale3d;

  (() => {
    const el = document.createElement('_');
    const style = el.style;

    if (style.webkitTransition === '') {
      transitionEnd = 'webkitTransitionEnd';
      transition = 'webkitTransition';
    }

    if (style.transition === '') {
      transitionEnd = 'transitionend';
      transition = 'transition';
    }

    if (style.webkitTransform === '') {
      transform = 'webkitTransform';
    }

    if (style.msTransform === '') {
      transform = 'msTransform';
    }

    if (style.transform === '') {
      transform = 'transform';
    }

    document.body.insertBefore(el, null);
    style[transform] = 'translate3d(0, 0, 0)';
    hasScale3d = !!global.getComputedStyle(el).getPropertyValue(transform);
    document.body.removeChild(el);
  })();

  return {
    transform,
    transition,
    transitionEnd,
    hasScale3d
  };
};

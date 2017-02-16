'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Detecting prefixes for saving time and bytes
 */
exports.default = function () {
  var transform = void 0;
  var transition = void 0;
  var transitionEnd = void 0;
  var hasScale3d = void 0;

  (function () {
    var el = document.createElement('_');
    var style = el.style;

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
    transform: transform,
    transition: transition,
    transitionEnd: transitionEnd,
    hasScale3d: hasScale3d
  };
};
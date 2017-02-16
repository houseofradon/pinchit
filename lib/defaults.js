'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  /**
   * default scale that will be set on element
   * @maxPinch {Number}
   */
  baseScale: 1,

  /**
   * max scale a node can reach
   * @maxPinch {Number}
   */
  maxScale: 3,

  /**
   * max scale a node can reach before bouncing back to maxScale
   * @maxScaleTimes {Number}
   */
  maxScaleTimes: 4,

  /**
   * min scale a node can reach
   * @minPinch {Number}
   */
  minScale: 1,

  /**
   * min scale a node can reach before bouncing back to minScale
   * @minScaleTimes {Number}
   */
  minScaleTimes: 0.8,

  /**
   * time for the snapBack of the pinch if the node has reach above
   * or below its pinch value
   * @snapBackSpeed {Number}
   */
  snapBackSpeed: 200,

  /**
   * Basic easing functions: https://developer.mozilla.org/de/docs/Web/CSS/transition-timing-function
   * cubic bezier easing functions: http://easings.net/de
   * @ease {String}
   */
  ease: 'ease'
};
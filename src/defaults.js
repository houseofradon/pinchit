export default {
  /**
   * max scale a node can reach
   * @maxPinch {Number}
   */
  maxPinch: 2.3,

  /**
   * min scale a node can reach
   * @minPinch {Number}
   */
  minPinch: 0.8,

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
  ease: 'ease',
};

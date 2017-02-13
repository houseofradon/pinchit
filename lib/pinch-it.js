'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _detectPrefixes = require('./utils/detect-prefixes');

var _detectPrefixes2 = _interopRequireDefault(_detectPrefixes);

var _dispatchEvent = require('./utils/dispatch-event');

var _dispatchEvent2 = _interopRequireDefault(_dispatchEvent);

var _pinch = require('./utils/pinch');

var _defaults = require('./defaults');

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pinchIt = function pinchIt(targets) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // private variable cache
  var elements = void 0;
  var scaling = void 0;
  var lastScale = void 0;
  var firstTouch = void 0;
  var lastTouch = void 0;

  var prefixes = (0, _detectPrefixes2.default)();

  /**
   *  dispatchPinchEvent - Shorthand method for creating events
   *
   *  @param { String } phase
   *  @param { String } type
   *  @param { Object } details
   *  @return { Void }
   **/
  var dispatchPinchEvent = function dispatchPinchEvent(phase, type) {
    (0, _dispatchEvent2.default)(elements, phase + '.pinch.' + type);
  };

  /**
   *  cancelEvent - Cancel Events so we dont bubble up our events to the document
   *
   *  @param { Object } event
   *  @return { Void }
   **/
  var cancelEvent = function cancelEvent(e) {
    e.stopPropagation();
    e.preventDefault();
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
  var scaleEl = function scaleEl(el, to, duration, ease) {
    var transition = prefixes.transition,
        transform = prefixes.transform,
        hasScale3d = prefixes.hasScale3d;
    var style = el.style;
    // Base our new dimention on our prevous value minus our base value

    var scaleProp = hasScale3d ? 'scale3d(' + to + ', ' + to + ', 1)' : 'scale(' + to + ', ' + to + ')';

    style[transition + 'TimingFunction'] = ease;
    style[transition + 'Duration'] = duration + 'ms';
    style[transform] = scaleProp;
  };

  // event handling

  /**
   * Set scaling if we are using more then one finger
   * and captures our first punch point
   *
   * private
   * @param { Object } e the event from our eventlistener
   */
  var onTouchstart = function onTouchstart() {
    return (/* opt */function (e) {
        scaling = e.touches.length === 2;
        firstTouch = Array.from(e.touches);

        cancelEvent(e);
        // Disable aniamtion so we can pinch
        // Set our initial starting point for our pinch
        // scaleEl(e.target, 1, 0, ease);

        dispatchPinchEvent('on', 'touchstart', { e: e });
      }
    );
  };

  var onTouchmove = function onTouchmove(_ref) {
    var ease = _ref.ease;
    return function (e) {
      if (!scaling || !firstTouch) return;
      dispatchPinchEvent('before', 'touchmove');

      // dont bubble touch event
      cancelEvent(e);

      lastTouch = Array.from(e.touches);
      var scale = (0, _pinch.calcNewScale)((0, _pinch.calcScale)(firstTouch, lastTouch), lastScale);
      scaleEl(e.target, scale, 0, ease);

      dispatchPinchEvent('after', 'touchmove');
    };
  };

  var onTouchend = function onTouchend(opts) {
    return function (e) {
      if (!firstTouch || !lastTouch) return;
      var scale = (0, _pinch.calcNewScale)((0, _pinch.calcScale)(firstTouch, lastTouch), lastScale);

      lastScale = (0, _pinch.getScale)(e.target);
      firstTouch = null;
      lastTouch = null;

      if (!(0, _pinch.isWithin)(scale, opts)) {
        var isLessThan = scale < opts.minScale;
        lastScale = isLessThan ? opts.minScale : opts.maxScale;
        scaleEl(e.target, lastScale, opts.snapBackSpeed, opts.ease);
      }
    };
  };

  var attachEvents = function attachEvents(opts) {
    return function (el) {
      el.addEventListener('touchstart', onTouchstart(opts));
      el.addEventListener('touchmove', onTouchmove(opts));
      el.addEventListener('touchend', onTouchend(opts));
    };
  };

  var detachhEvents = function detachhEvents(el) {
    el.removeEventListener('touchstart', onTouchstart);
    el.removeEventListener('touchmove', onTouchmove);
    el.removeEventListener('touchend', onTouchend);
  };

  /**
   * public
   * reset function:
   * @param { Number } duration
   * @param { String } easing
   * @return { Void }
   */
  var reset = function reset(opt) {
    return function (item) {
      var _defaults$opt = _extends({}, _defaults2.default, opt),
          snapBackSpeed = _defaults$opt.snapBackSpeed,
          easing = _defaults$opt.easing;

      if (item && !isNaN(item) && elements[item]) {
        scaleEl(elements[item], 1, snapBackSpeed, easing);
      } else {
        Array.from(elements).forEach(function (el) {
          return scaleEl(el, 1, snapBackSpeed, easing);
        });
      }

      lastScale = 1;
      firstTouch = null;
      lastTouch = null;
    };
  };

  /**
   * public
   * destroy function: called to gracefully destroy the lory instance
   * @return { Void }
   */
  var destroy = function destroy() {
    dispatchPinchEvent('before', 'destroy');
    // remove event listeners
    Array.from(elements).forEach(detachhEvents);
    dispatchPinchEvent('after', 'destroy');
  };

  /**
   * setup - Init function
   *
   * @param { String, Object }
   * @return { Void }
   **/

  var setup = function setup(target, opt) {
    if (elements) destroy();
    dispatchPinchEvent('before', 'init');

    // Base configuration for the pinch instance
    var opts = _extends({}, _defaults2.default, opt);

    // resolve target
    // pinchit allows for both a node or a string to be passed
    switch (typeof target === 'undefined' ? 'undefined' : _typeof(target)) {
      case 'object':
        elements = Array.isArray(target) ? target : [target];
        break;
      case 'string':
        elements = document.querySelectorAll(target);
        break;
      default:
        elements = [];
        console.warn('missing target, either pass an node or a string');
    }

    Array.from(elements).forEach(attachEvents(opts));

    dispatchPinchEvent('after', 'init');
  };

  // trigger initial setup
  setup(targets, options);

  return {
    setup: setup,
    reset: reset(options),
    destroy: destroy,
    elements: elements
  };
};

exports.default = pinchIt;
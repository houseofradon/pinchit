'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
//


var _dispatchEvent = require('./utils/dispatch-event');

var _dispatchEvent2 = _interopRequireDefault(_dispatchEvent);

var _handleEvent = require('./utils/handle-event');

var _handleElement = require('./utils/handle-element');

var _handleElement2 = _interopRequireDefault(_handleElement);

var _handlePinch = require('./utils/handle-pinch');

var _handleDrag = require('./utils/handle-drag');

var _defaults = require('./defaults');

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var first = function first(items) {
  return items[0];
};

var pinchIt = function pinchIt(targets) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // private variable cache
  var elements = void 0;

  var scaling = void 0;
  var lastScale = 1;
  var startTouches = void 0;

  var zoomFactor = 1;

  var offset = { x: 0, y: 0 };
  var lastZoomCenter = false;
  var lastDragPosition = false;

  var _eventDispatcher = (0, _dispatchEvent2.default)(),
      on = _eventDispatcher.on,
      dispatch = _eventDispatcher.dispatch;

  /**
   *  dispatchPinchEvent - Shorthand method for creating events
   *
   *  @param { String } phase
   *  @param { String } type
   *  @param { Object } details
   *  @return { Void }
   **/


  var dispatchPinchEvent = function dispatchPinchEvent(eventName, phase) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    dispatch(eventName, Object.assign(data, {
      phase: phase
    }));
  };

  var resetGlobals = function resetGlobals() {
    scaling = false;
    lastScale = 1;
    startTouches = null;
    zoomFactor = 1;
    lastZoomCenter = false;

    lastDragPosition = false;
    offset = { x: 0, y: 0 };
  };

  // event handling
  /**
   * Set scaling if we are using more then one finger
   * and captures our first punch point
   *
   * private
   * @param { Object } e the event from our eventlistener
   */
  var onTouchstart = function onTouchstart(opts) {
    return function (e) {
      dispatchPinchEvent('touchstart', 'before', e);

      scaling = e.touches.length === 2;
      startTouches = Array.from(e.touches);
      lastScale = 1;

      if ((0, _handleEvent.detectDoubleTap)(e)) {
        (0, _handleElement2.default)(e.target, 1, { x: 0, y: 0 }, opts.snapBackSpeed, opts.ease);
        resetGlobals();
      }

      dispatchPinchEvent('touchstart', 'after', e);
    };
  };

  var onTouchmove = function onTouchmove(opts) {
    return function (e) {
      dispatchPinchEvent('touchmove', 'before', e);

      if ((!scaling || !startTouches) && zoomFactor > 1) {
        (0, _handleEvent.cancelEvent)(e);

        var touch = first((0, _handleEvent.getTouches)(e.target, Array.from(e.touches)));
        var dragOffset = (0, _handleDrag.drag)(touch, lastDragPosition, offset, zoomFactor);

        offset = (0, _handleDrag.sanitizeOffset)(e.target, dragOffset, zoomFactor);
        lastDragPosition = touch;
      } else if (scaling && startTouches) {
        (0, _handleEvent.cancelEvent)(e);

        // a relative scale factor is used
        var touchCenter = (0, _handlePinch.getTouchCenter)((0, _handleEvent.getTouches)(e.target, Array.from(e.touches)));
        var newScale = (0, _handlePinch.calcScale)(e.target, startTouches, Array.from(e.touches));
        var scale = (0, _handlePinch.calcNewScale)(newScale, lastScale);

        var factor = (0, _handlePinch.scaleFactor)(scale, zoomFactor, opts);

        offset = (0, _handlePinch.addOffset)(offset, {
          x: (factor.scale - 1) * (touchCenter.x + offset.x),
          y: (factor.scale - 1) * (touchCenter.y + offset.y)
        });

        zoomFactor = factor.zoomFactor;
        lastScale = newScale;
        offset = (0, _handleDrag.drag)(touchCenter, lastZoomCenter, offset, zoomFactor);
        lastZoomCenter = touchCenter;
      }

      (0, _handleElement2.default)(e.target, zoomFactor, offset, 0, opts.ease);

      dispatchPinchEvent('touchmove', 'after', e);
    };
  };

  var onTouchend = function onTouchend(opts) {
    return function (e) {
      dispatchPinchEvent('touchend', 'before', e);

      lastDragPosition = false;
      lastZoomCenter = false;
      lastScale = 1;
      if (zoomFactor) {
        if (!(0, _handlePinch.isWithin)(zoomFactor, opts)) {
          var isLessThan = (0, _handlePinch.getInitialScale)(e.target) * zoomFactor < opts.minScale;
          zoomFactor = isLessThan ? opts.minScale : opts.maxScale;
          offset = (0, _handleDrag.sanitizeOffset)(e.target, offset, zoomFactor);
          (0, _handleElement2.default)(e.target, zoomFactor, offset, opts.snapBackSpeed, opts.ease);
        }
      }

      dispatchPinchEvent('touchend', 'after', e);
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
        (0, _handleElement2.default)(elements[item], 1, { x: 0, y: 0 }, snapBackSpeed, easing);
      } else {
        Array.from(elements).forEach(function (el) {
          return (0, _handleElement2.default)(el, 1, { x: 0, y: 0 }, snapBackSpeed, easing);
        });
      }

      resetGlobals();
    };
  };

  /**
   * public
   * destroy function: called to gracefully destroy the lory instance
   * @return { Void }
   */
  var destroy = function destroy() {
    dispatchPinchEvent('destroy', 'before', {});
    // remove event listeners
    Array.from(elements).forEach(detachhEvents);
    dispatchPinchEvent('destroy', 'after', {});
  };

  /**
   * setup - Init function
   *
   * @param { String, Object }
   * @return { Void }
   **/

  var setup = function setup(target, opt) {
    if (elements) destroy();
    dispatchPinchEvent('init', 'before', {});

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

    dispatchPinchEvent('init', 'after', {});
  };

  // trigger initial setup
  setup(targets, options);

  return {
    setup: setup,
    reset: reset(options),
    destroy: destroy,
    elements: elements,
    on: on
  };
};

exports.default = pinchIt;
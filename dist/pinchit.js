(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("pinchit", [], factory);
	else if(typeof exports === 'object')
		exports["pinchit"] = factory();
	else
		root["pinchit"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcNewScale = exports.calcScale = exports.getTouchCenter = exports.getCurrentPinchCenter = exports.scaleFactor = exports.getInitialScale = exports.getParentY = exports.getParentX = exports.addOffset = exports.isWithin = undefined;

var _handleEvent = __webpack_require__(1);

var sum = function sum(acc, next) {
  return acc + next;
};

/**
 * Calculates the average of multiple vectors (x, y values)
 */


var getVectorAvg = function getVectorAvg(vectors) {
  return {
    x: vectors.map(function (v) {
      return v.x;
    }).reduce(sum) / vectors.length,
    y: vectors.map(function (v) {
      return v.y;
    }).reduce(sum) / vectors.length
  };
};

var getParentElement = function getParentElement(type) {
  return function (el) {
    return el instanceof HTMLImageElement && el.parentElement instanceof HTMLDivElement ? el.parentElement[type] : 1;
  };
};

/**
 * isWithin - Check if value is between two values
 *
 * @param { Number } scale current scale value
 * @param { Object } minPinch, maxPinh
 * @return { Boolean }
 **/
var isWithin = exports.isWithin = function isWithin(scale, opts) {
  var maxScale = opts.maxScale,
      minScale = opts.minScale;

  return scale >= minScale && scale <= maxScale;
};

/**
 * addOffset - Combine current offset with old offset and returns a new offset
 *
 * @param { Object } lastOffset last offset
 * @param { Object } offset, new offset
 * @return { Object }
 **/
var addOffset = exports.addOffset = function addOffset(lastOffset, offset) {
  return {
    x: lastOffset.x + offset.x,
    y: lastOffset.y + offset.y
  };
};

var getParentX = exports.getParentX = getParentElement('offsetWidth');
var getParentY = exports.getParentY = getParentElement('offsetHeight');

/**
 * getScale - Check if value is between two values
 *
 * @param { Node } el current scale value
 * @return { Number }
 **/
var getInitialScale = exports.getInitialScale = function getInitialScale(el) {
  return el instanceof HTMLImageElement ? getParentX(el) / el.offsetWidth : 1;
};

/**
 * Scales the zoom factor relative to current state
 *
 * @param scale
 * @return the actual scale (can differ because of max min zoom factor)
 */
var scaleFactor = exports.scaleFactor = function scaleFactor(scale, factor, opts) {
  var originalFactor = factor;
  var zoomFactor = factor * scale;
  var maxScaleTimes = opts.maxScaleTimes,
      minScaleTimes = opts.minScaleTimes;

  zoomFactor = Math.min(maxScaleTimes, Math.max(zoomFactor, minScaleTimes));
  return {
    zoomFactor: zoomFactor,
    scale: zoomFactor / originalFactor
  };
};

/**
 * Calculates the virtual zoom center for the current offset and zoom factor
 * (used for reverse zoom)
 * @return {Object} the current zoom center
 */
var getCurrentPinchCenter = exports.getCurrentPinchCenter = function getCurrentPinchCenter(el, zoomFactor, offset) {
  var length = getParentX(el) * zoomFactor;
  var offsetLeft = offset.x;
  var offsetRight = length - offsetLeft - getParentX(el);
  var widthOffsetRatio = offsetLeft / offsetRight;
  var centerX = widthOffsetRatio * getParentX(el) / (widthOffsetRatio + 1);

  // the same for the zoomcenter y
  var height = getParentY(el) * zoomFactor;
  var offsetTop = offset.y;
  var offsetBottom = height - offsetTop - getParentY(el);
  var heightOffsetRatio = offsetTop / offsetBottom;
  var centerY = heightOffsetRatio * getParentY(el) / (heightOffsetRatio + 1);

  // prevents division by zero
  if (offsetRight === 0) {
    centerX = getParentX(el);
  }
  if (offsetBottom === 0) {
    centerY = getParentY(el);
  }

  return {
    x: centerX,
    y: centerY
  };
};

var getTouchCenter = exports.getTouchCenter = function getTouchCenter(touches) {
  return getVectorAvg(touches);
};

/**
 * calcScale - Calculate the distance between where we start our pinch
 * to where we end it
 *
 * @param { Array } startTouch The starting point of our touch
 * @param { Array } endTouch The current point of our touch
 * @return { Number }
 */
var calcScale = exports.calcScale = function calcScale(el, startTouch, endTouch) {
  return (0, _handleEvent.getDistance)((0, _handleEvent.getTouches)(el, endTouch)) / (0, _handleEvent.getDistance)((0, _handleEvent.getTouches)(el, startTouch));
};

var calcNewScale = exports.calcNewScale = function calcNewScale(to) {
  var lastScale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return to / lastScale;
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var lastTouchStart = 0;

/**
 * cancelEvent - Cancel Events so we dont bubble up our events to the document
 *
 * @param { Object } event
 * @return { Void }
 **/
var cancelEvent = exports.cancelEvent = function cancelEvent(e) {
  e.stopPropagation();
  e.preventDefault();
};

/**
 * detectDoubleTap - Check if we are double tapping
 *
 * @param { Object } event
 * @return { Boolean }
 **/
var detectDoubleTap = exports.detectDoubleTap = function detectDoubleTap(e) {
  var time = new Date().getTime();

  if (e.touches.length > 1) {
    lastTouchStart = 0;
  }

  if (time - lastTouchStart < 300) {
    cancelEvent(event);
    return true;
  }

  if (e.touches.length === 1) {
    lastTouchStart = time;
  }
  return false;
};

/**
 * Returns the touches of an event relative to the container offset
 *
 * @param event
 * @return array touches
 */
var getTouches = exports.getTouches = function getTouches(el, touches) {
  var position = el.parentElement.getBoundingClientRect();
  return touches.map(function (touch) {
    return {
      x: touch.pageX - (position.left + document.body.scrollLeft),
      y: touch.pageY - (position.top + document.body.scrollTop)
    };
  });
};

/**
 * getDistance - Calculate the distance between our fingers
 *
 * @param { Array } touches touches passas an array from TouchList
 * @return { Number } the calcualted distance between the fingers
 **/
var getDistance = exports.getDistance = function getDistance(touches) {
  var _touches = _slicedToArray(touches, 2),
      first = _touches[0],
      second = _touches[1];

  return Math.sqrt((first.x - second.x) * (first.x - second.x) + (first.y - second.y) * (first.y - second.y));
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pinchIt = __webpack_require__(4);

var _pinchIt2 = _interopRequireDefault(_pinchIt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _pinchIt2.default;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
//


var _dispatchEvent = __webpack_require__(6);

var _dispatchEvent2 = _interopRequireDefault(_dispatchEvent);

var _handleEvent = __webpack_require__(1);

var _handleElement = __webpack_require__(8);

var _handleElement2 = _interopRequireDefault(_handleElement);

var _handlePinch = __webpack_require__(0);

var _handleDrag = __webpack_require__(7);

var _defaults = __webpack_require__(3);

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var first = function first(items) {
  return items[0];
};

var pinchIt = function pinchIt(targets) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // private variable cache
  var elements = [];
  var opts = {};

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
    scaling = undefined;
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
  var onTouchstart = function onTouchstart(e) {
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

  var onTouchmove = function onTouchmove(e) {
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

  var onTouchend = function onTouchend(e) {
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

  var attachEvents = function attachEvents(el) {
    el.addEventListener('touchstart', onTouchstart);
    el.addEventListener('touchmove', onTouchmove);
    el.addEventListener('touchend', onTouchend);
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
    elements = [];
    resetGlobals();
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
    opts = _extends({}, _defaults2.default, opt);

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

    Array.from(elements).forEach(attachEvents);

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

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});


/**
 * dispatch custom events
 */

var eventDispatcher = function eventDispatcher() {
  var events = {};

  /**
   * Register a handler for event, to be fired
   * for every event.
   */
  var on = function on(eventName, handler) {
    events[eventName] = events[eventName] || [];
    events[eventName].push(handler);
    return undefined;
  };

  /**
   * Deregister a handler for event.
   */
  var off = function off(eventName, handler) {
    if (events[eventName]) {
      for (var i = 0; i < events[eventName].length; i += 1) {
        if (events[eventName][i] === handler) {
          events[eventName].splice(i, 1);
          break;
        }
      }
    }
  };

  var dispatch = function dispatch(eventName, data) {
    if (events[eventName]) {
      events[eventName].forEach(function (fn) {
        fn(data);
      });
    }
  };

  return {
    on: on,
    off: off,
    dispatch: dispatch
  };
};

exports.default = eventDispatcher;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drag = exports.sanitizeOffset = undefined;

var _handlePinch = __webpack_require__(0);

var calcMax = function calcMax(el, differ, zoomFactor) {
  return {
    maxX: (zoomFactor - differ) * (0, _handlePinch.getParentX)(el),
    maxY: (zoomFactor - differ) * (0, _handlePinch.getParentY)(el)
  };
};

var sanitizeOffset = exports.sanitizeOffset = function sanitizeOffset(el, offset, zoomFactor) {
  var _calcMax = calcMax(el, 1, zoomFactor),
      maxX = _calcMax.maxX,
      maxY = _calcMax.maxY;

  var maxOffsetX = Math.max(maxX, 0);
  var maxOffsetY = Math.max(maxY, 0);
  var minOffsetX = Math.min(maxX, 0);
  var minOffsetY = Math.min(maxY, 0);

  return {
    x: Math.min(Math.max(offset.x, minOffsetX), maxOffsetX),
    y: Math.min(Math.max(offset.y, minOffsetY), maxOffsetY)
  };
};

var drag = exports.drag = function drag(center, lastCenter, lastOffset, zoomFactor) {
  return Object.prototype.hasOwnProperty.call(lastCenter, 'x') ? (0, _handlePinch.addOffset)(lastOffset, {
    x: -((center.x - lastCenter.x) * zoomFactor / zoomFactor),
    y: -((center.y - lastCenter.y) * zoomFactor / zoomFactor)
  }) : lastOffset;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _detectPrefixes = __webpack_require__(5);

var _detectPrefixes2 = _interopRequireDefault(_detectPrefixes);

var _handlePinch = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefixes = (0, _detectPrefixes2.default)();

var handleAnimation = function handleAnimation(el, transition, duration, ease) {
  var style = el.style;

  style.transformOrigin = '0% 0%';
  style[transition + 'TimingFunction'] = ease;
  style[transition + 'Duration'] = duration + 'ms';
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

exports.default = function (el, pinch, coords, duration, ease) {
  var transition = prefixes.transition,
      transform = prefixes.transform,
      hasScale3d = prefixes.hasScale3d;
  var style = el.style;


  var zoomFactor = (0, _handlePinch.getInitialScale)(el) * pinch;

  var offsetX = -coords.x;
  var offsetY = -coords.y;

  handleAnimation(el, transition, duration, ease);
  var scaleProp = hasScale3d ? 'scale3d(' + zoomFactor + ', ' + zoomFactor + ', 1)' : 'scale(' + zoomFactor + ', ' + zoomFactor + ')';
  var translateProp = 'translate(' + offsetX + 'px, ' + offsetY + 'px)';

  style[transform] = translateProp + ' ' + scaleProp;
};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ })
/******/ ]);
});
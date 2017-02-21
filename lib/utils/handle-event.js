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
  var position = el.getBoundingClientRect();
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

/**
 * calcScale - Calculate the distance between where we start our pinch
 * to where we end it
 *
 * @param { Array } startTouch The starting point of our touch
 * @param { Array } endTouch The current point of our touch
 * @return { Number }
 */
var calcScale = exports.calcScale = function calcScale(el, startTouch, endTouch) {
  return getDistance(getTouches(el, endTouch)) / getDistance(getTouches(el, startTouch));
};
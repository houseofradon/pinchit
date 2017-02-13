"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * calcDist - Calculate the distance between our fingers
 *
 * @param { Array } touches touches passas an array from TouchList
 * @return { Number } the calcualted distance between the fingers
 **/
var calcDist = exports.calcDist = function calcDist(touches) {
  var _touches = _slicedToArray(touches, 2),
      first = _touches[0],
      second = _touches[1];

  return Math.sqrt((first.pageX - second.pageX) * (first.pageX - second.pageX) + (first.pageY - second.pageY) * (first.pageY - second.pageY));
};

/**
isWithin - Check if value is between two values
 *
 * @param { Number } scale current scale value
 * @param { Object } minPinch, maxPinh
 * @return { Boolean }
 **/
var isWithin = exports.isWithin = function isWithin(scale, opts) {
  var maxScale = opts.maxScale,
      minScale = opts.minScale;

  return scale > minScale && scale < maxScale;
};

/**
 * getScale - Check if value is between two values
 *
 * @param { Node } el current scale value
 * @return { Number }
 **/
var getScale = exports.getScale = function getScale(el) {
  return el.getBoundingClientRect().width / el.offsetWidth;
};

/**
 * calcScale - Calculate the distance between where we start our pinch
 * to where we end it
 *
 * @param { Array } startTouch The starting point of our touch
 * @param { Array } endTouch The current point of our touch
 * @return { Number }
 */
var calcScale = exports.calcScale = function calcScale(startTouch, endTouch) {
  return calcDist(endTouch) / calcDist(startTouch);
};

var calcNewScale = exports.calcNewScale = function calcNewScale(to) {
  var lastScale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return to + (lastScale - 1);
};
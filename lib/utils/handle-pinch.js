'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcNewScale = exports.calcScale = exports.getTouchCenter = exports.getCurrentPinchCenter = exports.scaleFactor = exports.getInitialScale = exports.getParentY = exports.getParentX = exports.addOffset = exports.isWithin = undefined;

var _handleEvent = require('./handle-event');

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
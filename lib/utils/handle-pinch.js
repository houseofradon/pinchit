'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

var getElement = function getElement(type) {
  return function (el) {
    return el instanceof HTMLImageElement ? el[type] : 1;
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

var getX = exports.getX = getElement('offsetWidth');
var getY = exports.getY = getElement('offsetHeight');

/**
 * getScale - Check if value is between two values
 *
 * @param { Node } el current scale value
 * @return { Number }
 **/
var getInitialScale = exports.getInitialScale = function getInitialScale(el, image) {
  return el instanceof HTMLImageElement ? getX(el) / image.offsetWidth : 1;
};

/**
 * Scales the zoom factor relative to current state
 *
 * @param scale
 * @return the actual scale (can differ because of max min zoom factor)
 */
var getScaleFactor = exports.getScaleFactor = function getScaleFactor(scale, factor, opts) {
  var originalFactor = factor;
  var zoomFactor = factor * scale;
  var maxScaleTimes = opts.maxScaleTimes,
      minScaleTimes = opts.minScaleTimes;

  zoomFactor = Math.min(maxScaleTimes, Math.max(zoomFactor, minScaleTimes));
  return zoomFactor / originalFactor;
};

/**
 * Scales the zoom factor relative to current state
 *
 * @param scale
 * @return the actual scale (can differ because of max min zoom factor)
 */
var getZoomFactor = exports.getZoomFactor = function getZoomFactor(scale, factor, opts) {
  var zoomFactor = factor * scale;
  var maxScaleTimes = opts.maxScaleTimes,
      minScaleTimes = opts.minScaleTimes;

  return zoomFactor = Math.min(maxScaleTimes, Math.max(zoomFactor, minScaleTimes));
};

var getTouchCenter = exports.getTouchCenter = function getTouchCenter(touches) {
  return getVectorAvg(touches);
};

var calcNewScale = exports.calcNewScale = function calcNewScale(to) {
  var lastScale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return to / lastScale;
};
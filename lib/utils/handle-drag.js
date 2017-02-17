'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drag = exports.sanitizeOffset = undefined;

var _handlePinch = require('./handle-pinch');

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
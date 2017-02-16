'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _detectPrefixes = require('./detect-prefixes');

var _detectPrefixes2 = _interopRequireDefault(_detectPrefixes);

var _handlePinch = require('./handle-pinch');

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

  console.log('getInitialScale', (0, _handlePinch.getInitialScale)(el));
  console.log('pinch', pinch);
  console.log('coords.x', coords.x);
  console.log('offsetx', offsetX);
  console.log('');

  handleAnimation(el, transition, duration, ease);
  var scaleProp = hasScale3d ? 'scale3d(' + zoomFactor + ', ' + zoomFactor + ', 1)' : 'scale(' + zoomFactor + ', ' + zoomFactor + ')';
  var translateProp = 'translate(' + offsetX + 'px, ' + offsetY + 'px)';

  style[transform] = translateProp + ' ' + scaleProp;
};
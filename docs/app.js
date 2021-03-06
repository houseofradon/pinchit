import "babel-polyfill";

import prism from 'prismjs';
import 'prismjs/themes/prism.css';

import handleEvent from './handle-event';
import pinchIt from '../src/';

pinchIt('.example-one .img-wrapper');
pinchIt('.example-tree .img-wrapper', {
  maxScale: 4,
  minScale: 0.5,
  snapBackSpeed: 500,
});

const pinchImage = pinchIt('.example-four .img-wrapper', {
  snapBackSpeed: 1000,
});

document
  .querySelector('.reset-button')
  .addEventListener('click', () => {
    pinchImage.reset();
  });

const target = document.querySelector('.event-target');
const handleEventExample = handleEvent(target);
const pinchEvent = pinchIt('.example-five .img-wrapper', {
  target: 'img',
  snapBackSpeed: 1000,
});

pinchEvent.on('touchstart', handleEventExample);
pinchEvent.on('touchmove', handleEventExample);

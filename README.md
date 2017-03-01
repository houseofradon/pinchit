## Pinch it

[![Build Status](https://travis-ci.org/houseofradon/pinchit.svg?branch=master)](https://travis-ci.org/Knape/pinchit)
[![Coverage Status](https://coveralls.io/repos/github/houseofradon/pinchit/badge.svg?branch=master)](https://coveralls.io/github/Knape/pinchit?branch=master)
[![Sauce Test Status](https://saucelabs.com/buildstatus/pinchit)](https://saucelabs.com/u/pinchit)

### Description
Zoom images without dependencies

### Install with npm

```bash
npm install --save pinchit
```

### Install with bower

```bash
bower install pinchit --save
```

## Usage

### Prerequisited markup

```html
<div class="img-wrapper">
    <img src="" alt="">
</div>
```

### Prerequisited css

```css
.img-wrapper {
  overflow: hidden;
}

.img-wrapper img {
  max-width: 100%;
}

```

### Integration - ES6

```js
  import pinchit from 'pinchit';
  var wrapper = document.querySelectorAll('.img-wrapper');

  pinchit(wrapper, {
      // options going here
  });
```

### Integration - ES5

```html
<script src="/path/to/dist/pinchit.js" charset="utf-8"></script>
```

```js
  var wrapper = document.querySelectorAll('.img-wrapper');

  pinchit.default(wrapper, {
      // options going here
  });
```


## Public API

|Name|Description|arguments|returns|
|---|---|---|---|
|setup|Binds eventlisteners, merging default and user options, setup the pinch based on DOM (called once during initialisation). Call setup if DOM or user options have changed or eventlisteners needs to be rebinded.|String or node|Void|
|reset|Sets the pan back to the starting position or position passed to method|Object|void|
|destroy|Resets and destroys the pinchit instance by removing all pinchit specific event listeners|Object|Void|

## Options

|Name|Description|Type|Default|
|---|---|---|---|
|target|If multiple images are inside wrapper, pass a target css selector to select the preferred image|String|null|
|baseScale|Default scale that will be set on element|Number|1|
|maxScale|Max scale a node can reach|Number|3|
|maxScaleTimes|Max scale a node can reach before bouncing back to maxScale|Number|4|
|maxScale|Mix scale a node can reach|Number|1|
|maxScaleTimes|Mix scale a node can reach before bouncing back to mixScale|Number|0.8|
|snapBackSpeed|Time for the snapBack of the pinch if the node has reach above or below its pinch value|Number|200|
|ease|Default easing method|String|ease|

## Browser support

[![Sauce Test Status](https://saucelabs.com/browser-matrix/pinchit.svg)](https://saucelabs.com/u/pinchit)

Note: If you attend to use this module with older browser its mandatory to polyfill both `Array.from` and `Object.assign`

## License

[MIT](LICENSE). Copyright (c) 2017 Philip Knape.

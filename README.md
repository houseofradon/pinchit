## Pinch it

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
/**

 */
.img-wrapper {
  overflow: hidden;
}

.img-wrapper img {
  max-width: 100%;
}

```

### Integration

```js
  import pinchit from 'pinchit';
  var pinch = document.querySelectorAll('img');

  pinchit(pinch, {
      // options going here
  });
```

## Public API

<table>
  <tr>
    <td>setup</td>
    <td>Binds eventlisteners, merging default and user options, setup the pinch based on DOM (called once during initialisation). Call setup if DOM or user options have changed or eventlisteners needs to be rebinded.</td>
  </tr>
  <tr>
    <td>reset</td>
    <td>sets the pinch back to the starting position</td>
  </tr>
  <tr>
    <td>destroy</td>
    <td>destroys the pinchit instance by removing all pinch specific event listeners</td>
  </tr>
</table>

## Options

<table>
  <tr>
    <td>baseScale</td>
    <td>Default scale that will be set on element</td>
  </tr>
  <tr>
    <td>maxScale</td>
    <td>Max scale a node can reach</td>
  </tr>
  <tr>
    <td>minScale</td>
    <td>Min scale a node can reach</td>
  </tr>
  <tr>
    <td>snapBackSpeed</td>
    <td>time for the snapBack of the pinch if the node has reach above or below its pinch value</td>
  </tr>
  <tr>
    <td>ease</td>
    <td>default easing method</td>
  </tr>
</table>

### Browser Support

* Chrome
* Safari
* FireFox

## License

[MIT](LICENSE). Copyright (c) 2016 Philip Knape.

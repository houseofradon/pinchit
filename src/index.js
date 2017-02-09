
const pinchIt = () => {
  // private variable cache

  let elements;         // element to scroll to                   (node)
  let scaling;         // element to scroll to                   (node)

  const calcDist = (e) => (
    Math.sqrt(
      ((e.touches[0].x - e.touches[1].x) * (e.touches[0].x - e.touches[1].x)) +
      ((e.touches[0].y - e.touches[1].y) * (e.touches[0].y - e.touches[1].y))
    )
  );

  const attachEvents = (el) => {
    el.addEventListener('touchstart', (e) => {
      console.log(e.touches);
      scaling = (e.touches.length === 2);
    });

    el.addEventListener('touchmove', (e) => {
      if (scaling) {
        console.log('scaling');
      }
    });

    el.addEventListener('touchend', (e) => {
      scaling = false;
    });
  };

  const pinch = (target, options = {}) => {
    const opt = Object.assign({}, {

    }, options);

    // resolve target
    switch (typeof target) {
      case 'object':
        elements = target;
        break;
      case 'string':
        elements = document.querySelectorAll(target);
        break;
      default:
        console.warn('missing target, either pass an node or a string');
    }

    elements.forEach(attachEvents);

  };



  return pinch;
};

export default pinchIt();


const pinchIt = () => {
  // private variable cache

  let elements;
  let scaling;
  let firstMove;
  let firstTouch;

  const cancelEvent = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const calcDist = (touches) => {
    console.log(touches);
    const [first, second] = touches;
    return Math.sqrt(
      ((first.pageX - second.pageX) * (first.pageX - second.pageX)) +
      ((first.pageY - second.pageY) * (first.pageY - second.pageY))
    );
  };

  const calcScale = (startTouch, endTouch) => (
    calcDist(endTouch) / calcDist(startTouch)
  );

  const attachEvents = (el) => {
    el.addEventListener('touchstart', (e) => {
      scaling = (e.touches.length === 2);
      firstMove = true;
    });

    el.addEventListener('touchmove', (e) => {
      const { target } = e;
      if (scaling && !firstTouch) {
        firstTouch = Array.from(e.touches);
      }
      if (scaling && firstTouch) {
        cancelEvent(e);
        const scale = calcScale(firstTouch, Array.from(e.touches));
        target.style.transform = `scale(${scale})`;
      }
      firstMove = false;
    });

    el.addEventListener('touchend', () => {
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

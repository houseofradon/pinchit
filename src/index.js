
const pinchIt = () => {
  // private variable cache

  let element         // element to scroll to                   (node)

  const pinch = (target, options = {}) => {
    // resolve target
    switch (typeof target) {
      case 'object':
        element = target;
        break;
      case 'string':
        element = document.querySelector(target);
        break;
    }
  };

  return pinch;
};

export default pinchIt;

export const coordSequence = [
  [
    { pageX: 0, pageY: 10},
    { pageX: 10, pageY: 10}
  ],
  [
    { pageX: 10, pageY: 20},
    { pageX: 20, pageY: 20}
  ],
  [
    { pageX: 20, pageY: 30},
    { pageX: 40, pageY: 30}
  ]
];

export const extractTransform = (value: string, match: string): string => {
  const items = value.split(')');
  const foundItem = items.find(item => item.indexOf(match) > -1);
  return (foundItem) ? foundItem + ')' : '';
};

export const extractStyleProp = (style: string) => (
  style
    .slice(style.indexOf('(') + 1, style.lastIndexOf(')'))
    .split(',')
    .map((n) => {
      return !isNaN(parseFloat(n, 10)) ? parseFloat(n, 10) : 0;
    })
);

export const createPinch = (element, startX, startY) => (exp, onlyOne = false) => {
  const { width, height, left, top} = element.getBoundingClientRect();

  const middleY = (height * startY) + top;
  const middleX = (width * startX) + left;
  const extra = (onlyOne) ? [] : [{ pageX: middleX + exp, pageY: middleY}];
  return [
    { pageX: middleX - exp, pageY: middleY},
  ].concat(extra);
};

export const exportProps = (element, index = 1) => {
  const preTranslate = extractTransform(element.childNodes[index].style.transform, 'translate');
  const preScale = extractTransform(element.childNodes[index].style.transform, 'scale');
  const preOffset = extractStyleProp(preTranslate);
  const preCalcScale = extractStyleProp(preScale);
  return {
    scale: preCalcScale,
    translate: preOffset,
  };
};

export const touchEvent = (eventType, el, timeout, coords) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = document.createEvent('Event');
      const touches = coords.map((coord, i) => Object.assign(coord, {
        target: el,
        identifier: i,
      }));

      event.initEvent(eventType, true, true);
      event.touches = touches;
      event.targetTouches = touches;
      event.changedTouches = touches;
      el.dispatchEvent(event);
      resolve(el);
    }, timeout);
  });
};

export const resizeEvent = (el, timeout) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('resize', true, false);
      el.dispatchEvent(event);
      resolve({el, event});
    }, timeout);
  });
};

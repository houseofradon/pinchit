// @flow

/**
 * dispatch custom events
 */

const eventDispatcher = () => {
  const events = {};

  /**
   * Register a handler for event, to be fired
   * for every event.
   */
  const on = (eventName: string, handler: Function) => {
    events[eventName] = events[eventName] || [];
    events[eventName].push(handler);
    return this;
  };

  /**
   * Deregister a handler for event.
   */
  const off = (eventName: string, handler: Function) => {
    if (events[eventName]) {
      for (let i = 0; i < events[eventName].length; i += 1) {
        if (events[eventName][i] === handler) {
          events[eventName].splice(i, 1);
          break;
        }
      }
    }
  };

  const dispatch = (eventName: string, data: Object) => {
    if (events[eventName]) {
      events[eventName].forEach((fn) => {
        fn(data);
      });
    }
  };

  return {
    on,
    off,
    dispatch,
  };
};


export default eventDispatcher;

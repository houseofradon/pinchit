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
   * dispatch an event for a handler.
   */
  const dispatch = (eventName: string, data: Object) => {
    if (events[eventName]) {
      events[eventName].forEach((fn) => {
        fn(data);
      });
    }
  };

  return {
    on,
    dispatch,
  };
};


export default eventDispatcher;

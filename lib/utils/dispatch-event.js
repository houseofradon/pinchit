"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});


/**
 * dispatch custom events
 */

var eventDispatcher = function eventDispatcher() {
  var events = {};

  /**
   * Register a handler for event, to be fired
   * for every event.
   */
  var on = function on(eventName, handler) {
    events[eventName] = events[eventName] || [];
    events[eventName].push(handler);
    return undefined;
  };

  /**
   * Deregister a handler for event.
   */
  var off = function off(eventName, handler) {
    if (events[eventName]) {
      for (var i = 0; i < events[eventName].length; i += 1) {
        if (events[eventName][i] === handler) {
          events[eventName].splice(i, 1);
          break;
        }
      }
    }
  };

  var dispatch = function dispatch(eventName, data) {
    if (events[eventName]) {
      events[eventName].forEach(function (fn) {
        fn(data);
      });
    }
  };

  return {
    on: on,
    off: off,
    dispatch: dispatch
  };
};

exports.default = eventDispatcher;
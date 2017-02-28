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
   * dispatch an event for a handler.
   */
  var dispatch = function dispatch(eventName, data) {
    if (events[eventName]) {
      events[eventName].forEach(function (fn) {
        fn(data);
      });
    }
  };

  return {
    on: on,
    dispatch: dispatch
  };
};

exports.default = eventDispatcher;
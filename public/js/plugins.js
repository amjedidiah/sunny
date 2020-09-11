/* eslint-disable func-names */
/* eslint-disable one-var */
// Avoid `console` errors in browsers that lack a console.
(function () {
  const noop = function () {},
    methods = [
      'assert',
      'clear',
      'count',
      'debug',
      'dir',
      'dirxml',
      'error',
      'exception',
      'group',
      'groupCollapsed',
      'groupEnd',
      'info',
      'log',
      'markTimeline',
      'profile',
      'profileEnd',
      'table',
      'time',
      'timeEnd',
      'timeline',
      'timelineEnd',
      'timeStamp',
      'trace',
      'warn'
    ],
    console = window.console || {};

  let method,
    { length } = methods;

  // eslint-disable-next-line no-plusplus
  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
}());

// Place any jQuery/helper plugins in here.

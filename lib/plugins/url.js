
/**
 * Module dependencies.
 */

var func = require('rework-plugin-function');

/**
 * Map `url()` calls.
 *
 *   body {
 *     background: url(/images/bg.png);
 *   }
 *
 * yields:
 *
 *   body {
 *     background: url(http://example.com/images/bg.png);
 *   }
 *
 */

module.exports = function(fn) {
  return func({
    url: function(path){
      return 'url("' + fn(path) + '")';
    }
  }, false);
};

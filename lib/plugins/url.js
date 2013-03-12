
/**
 * Module dependencies.
 */

var utils = require('../utils')
  , func = require('./function');

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
  return func({ url: url });

  function url(path){
    return 'url("' + fn(path) + '")';
  };
};

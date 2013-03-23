
/**
 * Module dependencies.
 */

var parse = require('color-parser')
  , functions = require('./function');

/**
 * Provide color manipulation helpers:
 *
 *    button {
 *      background: rgba(#eee, .5)
 *    }
 *
 * yields:
 *
 *    button {
 *      background: rgba(238, 238, 238, .5)
 *    }
 *
 */

module.exports = function() {
  return functions({
    rgba: function(color, alpha){
      if (2 == arguments.length) {
        var c = parse(color.trim());
        var args = [c.r, c.g, c.b, alpha];
      } else {
        var args = [].slice.call(arguments);
      }
      
      return 'rgba(' + args.join(', ') + ')';
    }
  });
};

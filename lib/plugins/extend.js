/**
 * Module dependencies.
 */

var debug = require('debug')('rework:extend');
var inherit = require('rework-inherit');

/**
 * Add extension support.
 */

module.exports = function() {
  debug('use extend')

  return inherit({
    propertyRegExp: /^extends?$/,
    disableMediaInheritance: true
  })
}
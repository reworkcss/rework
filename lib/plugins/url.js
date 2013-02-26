
/**
 * Module dependencies.
 */

var utils = require('../utils')
  , visit = require('../visit');

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
  return function(style, rework){
    visit.declarations(style, function(declarations){
      declarations.forEach(function(decl, i){
        if (!~decl.value.indexOf('url(')) return;
        decl.value = decl.value.replace(/url\(([^)]+)\)/g, function(_, url){
          url = utils.stripQuotes(url);
          return 'url("' + fn(url) + '")';
        });
      });
    });
  }
};

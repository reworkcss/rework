
/**
 * Module dependencies.
 */
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var visit = require('../visit');

/**
 * Inline images and fonts.
 *
 *    .logo {
 *      background: inline(icons/logo.png);
 *    }
 *
 * yields:
 *
 *    .logo {
 *      background: url("data:image/png;base64,iVBORw0…");
 *    }
 *
 */

module.exports = function() {
  if (Array.isArray(arguments[0])) {
    var dirs = arguments[0];
  } else {
    var dirs = Array.prototype.slice.call(arguments);
  }
  return function(style, rework){
    visit.declarations(style, function(declarations){
      declarations.forEach(function(decl){
        if (!~decl.value.indexOf('inline(')) return;
        decl.value = decl.value.replace(/inline\(([^)]+)\)/g, function(_, name){

          var file = dirs.map(function(dir) {
            return path.join(dir, name);
          }).filter(function(filePath){
            return fs.existsSync(filePath)
          })[0];
          if (!file) throw new Error("Can't find `" + name + "` to inline");

          var type = mime.lookup(file);
          var base64 = new Buffer(fs.readFileSync(file)).toString('base64');
          return 'url("data:' + type + ';base64,' + base64 + '")';
        });
      });
    });
  }
};

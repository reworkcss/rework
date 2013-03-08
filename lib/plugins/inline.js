
/**
 * Module dependencies.
 */

var func = require('./func')
  , path = require('path')
  , mime = require('mime')
  , fs = require('fs')
  , read = fs.readFileSync;

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

module.exports = function(dirs) {
  if (!Array.isArray(dirs)) {
    dirs = Array.prototype.slice.call(arguments);
  }

  return func({ inline: inline });

  function inline(fileName){
    var file = dirs.map(function(dir) {
      return path.join(dir, fileName);
    }).filter(function(filePath){
      return fs.existsSync(filePath)
    })[0];

    if (!file) throw new Error("Can't find `" + fileName + "` to inline");

    var type = mime.lookup(file);
    var base64 = new Buffer(read(file)).toString('base64');
    return 'url("data:' + type + ';base64,' + base64 + '")';
  }
};

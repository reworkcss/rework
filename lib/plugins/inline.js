
/**
 * Module dependencies.
 */

var func = require('./function')
  , path = require('path')
  , mime = require('mime')
  , fs = require('fs')
  , read = fs.readFileSync
  , exists = fs.existsSync;

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

  function inline(filename){
    var file = dirs.map(function(dir) {
      return path.join(dir, filename);
    }).filter(exists)[0];

    if (!file) throw new Error('inline(): failed to find "' + filename + '"');

    var type = mime.lookup(file);
    var base64 = new Buffer(read(file)).toString('base64');
    return 'url("data:' + type + ';base64,' + base64 + '")';
  }
};


/**
 * Module dependencies.
 */

var css = require('css')
  , fs = require('fs')
  , path = require('path')
  , utils = require('../utils');

/**
 * Read and inline imported stylesheets.
 *
 * main.css:
 *    @import "imported.css"
 *
 *    a {
 *      color: yellow
 *    }
 *
 * imported.css:
 *    span {
 *      color: red
 *    }
 *
 * yields:
 *
 *    a {
 *      color: yellow
 *    }
 *
 *    span {
 *      color: red
 *    }
 */

module.exports = function(basepath) {
  if (!basepath) basepath = process.cwd();

  return function importPlugin(style, rework) {
    var rules = [];
    var files = {};

    visit(style, basepath + path.sep + ".");
    rework.obj.stylesheet.rules = rules;

    function visit(style, file) {
      if (files[file] == 'importing')
        throw new Error('Import cycle detected on ' + file);
      else if (files[file])
        return;

      files[file] = 'importing';

      for (var i = 0; i < style.rules.length; i++) {
        var rule = style.rules[i];
        if (!rule.import) continue;

        var filename = rule.import.replace(/url\(([^)]+)\)/g, function(_, url) {
          return url;
        });

        filename = utils.stripQuotes(filename);
        if (/^\s*http/.test(filename)) continue;
        filename = path.resolve(path.dirname(file), filename);
        if (!fs.existsSync(filename)) continue;
        style.rules.splice(i--, 1);
        visit(css.parse(fs.readFileSync(filename, 'utf8')).stylesheet, filename);
      }

      files[file] = 'imported';

      rules = rules.concat(style.rules);
    }
  };
};

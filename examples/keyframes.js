
/**
 * Module dependencies.
 */

var rework = require('..')
  , fs = require('fs')
  , read = fs.readFileSync;

var css = rework(read('examples/keyframes.css', 'utf8'))
  .prefix('border-radius', ['-webkit-', '-moz-'])
  .prefix('@keyframes', ['-webkit-', '-moz-'])
  .toString();

console.log(css);
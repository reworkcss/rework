
var rework = require('..')
  , read = require('fs').readFileSync;

var css = rework(read('examples/opacity.css', 'utf8'))
  .vendors(['-webkit-', '-moz-'])
  .use(rework.opacity())
  .toString()

console.log(css);
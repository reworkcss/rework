
var rework = require('..')
  , read = require('fs').readFileSync;

var css = rework(read('examples/gradients.css', 'utf8'))
  .vendors(['-webkit-', '-moz-'])
  .use(rework.prefixValue('linear-gradient'))
  .use(rework.prefixValue('radial-gradient'))
  .toString()

console.log(css);
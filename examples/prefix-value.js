
var rework = require('..')
  , read = require('fs').readFileSync;

var css = rework(read('examples/prefix-value.css', 'utf8'))
  .vendors(['-webkit-', '-moz-'])
  .use(rework.prefix('transition'))
  .use(rework.prefixValue('transform'))
  .toString()

console.log(css);
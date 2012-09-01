
var rework = require('..')
  , read = require('fs').readFileSync;

var css = rework(read('examples/prefix.css', 'utf8'))
  .vendors(['-webkit-', '-moz-'])
  .use(rework.prefix('border-radius'))
  .use(rework.prefix('box-shadow'))
  .toString()

console.log(css);
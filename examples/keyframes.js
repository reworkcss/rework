
var rework = require('..')
  , read = require('fs').readFileSync;

var css = rework(read('examples/keyframes.css', 'utf8'))
  .vendors(['-webkit-', '-moz-', '-ms-'])
  .use(rework.keyframes())
  .use(rework.opacity())
  .use(rework.prefix('border-radius'))
  .toString()

console.log(css);
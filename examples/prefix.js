
var rework = require('..')
  , read = require('fs').readFileSync;

var css = rework(read('./prefix.css', 'utf8'))
  .vendors(['-webkit-', '-moz-'])
  .use(rework.prefix('border-radius'))
  .use(rework.prefix('box-shadow'))
  .use(rework.prefix('linear-gradient'))
  .use(rework.prefix('radial-gradient'))
  .toString()

console.log(css);
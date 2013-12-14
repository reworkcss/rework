
var rework = require('..')
  , read = require('fs').readFileSync;

var css = rework(read('examples/at2x.css', 'utf8'))
  .use(rework.at2x())
  .toString()

console.log(css);
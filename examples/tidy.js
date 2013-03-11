
var rework = require('..')
  , read = require('fs').readFileSync;

var css = rework(read('examples/tidy.css', 'utf8'))
  .use(rework.tidy())
  .toString();

console.log(css);


var rework = require('..')
  , read = require('fs').readFileSync;

var css = rework(read('examples/inline.css', 'utf8'))
  .use(rework.inline('examples/'))
  .toString()

console.log(css);

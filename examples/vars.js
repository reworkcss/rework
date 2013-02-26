
var rework = require('..')
  , read = require('fs').readFileSync;

var css = rework(read('examples/vars.css', 'utf8'))
  .use(rework.vars())
  .toString()

console.log(css);

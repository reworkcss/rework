
var rework = require('..')
  , read = require('fs').readFileSync;

var css = rework(read('examples/colors.css', 'utf8'))
  .use(rework.colors())
  .toString()

console.log(css);
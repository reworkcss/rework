
var rework = require('..')
  , read = require('fs').readFileSync;

var css = rework(read('examples/extend.css', 'utf8'))
  .use(rework.extend())
  .toString();

console.log(css);

var rework = require('..')
  , read = require('fs').readFileSync;

var css = rework(read('examples/property-references.css', 'utf8'))
  .use(rework.references())
  .toString()

console.log(css);
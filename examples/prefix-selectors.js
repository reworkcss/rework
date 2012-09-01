
var rework = require('..')
  , read = require('fs').readFileSync;

var css = rework(read('examples/prefix-selectors.css', 'utf8'))
  .use(rework.prefixSelectors('#dialog'))
  .toString()

console.log(css);
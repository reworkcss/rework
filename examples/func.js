
var rework = require('..')
  , read = require('fs').readFileSync;

var css = rework(read('examples/func.css', 'utf8'))
  .use(rework.func({
    black: black
  }))
  .toString()

function black(opacity) {
  return 'rgba(0, 0, 0, ' + opacity + ')';
}

console.log(css);


var rework = require('..')
  , read = require('fs').readFileSync;

var css = rework(read('examples/function.css', 'utf8'))
  .use(rework.function({
    black: black
  }))
  .toString()

function black(opacity) {
  return 'rgba(0, 0, 0, ' + opacity + ')';
}

console.log(css);


var rework = require('..')
  , read = require('fs').readFileSync;

var css = rework(read('examples/sink.css', 'utf8'))
  .vendors(['-webkit-', '-moz-'])
  .use(rework.keyframes())
  .use(rework.prefixValue('transform'))
  .use(rework.prefix('backface-visibility'))
  .use(rework.prefix('border-radius'))
  .use(rework.prefix('transform-origin'))
  .use(rework.prefix('transform'))
  .use(rework.prefix('transition'))
  .use(rework.prefix('box-shadow'))
  .toString()

console.log(css);
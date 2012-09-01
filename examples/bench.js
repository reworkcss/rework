
var rework = require('..')
  , read = require('fs').readFileSync
  , str = read('examples/sink.css', 'utf8');

var times = 2000
  , n = times
  , start = new Date;

while (n--) {
  rework(str)
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
}

var dur = new Date - start;
console.log('  %d times', times);
console.log('  %d ops/s', times / (dur / 1000) | 0);
console.log('  %d ms', dur);

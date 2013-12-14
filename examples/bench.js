
var rework = require('..')
  , read = require('fs').readFileSync
  , str = read('examples/extend.css', 'utf8');

var times = 2000
  , n = times
  , start = new Date;

while (n--) {
  rework(str)
    .use(rework.extend())
    .toString();
}

var dur = new Date - start;
console.log('  %d times', times);
console.log('  %d ops/s', times / (dur / 1000) | 0);
console.log('  %d ms', dur);


var rework = require('..')
  , read = require('fs').readFileSync;

var css = rework(read('examples/ellipsis.css', 'utf8'))
  .use(rework.mixin({
    overflow: ellipsis
  }))
  .toString()

function ellipsis(type) {
  if ('ellipsis' == type) {
    return {
      'white-space': 'nowrap',
      'overflow': 'hidden',
      'text-overflow': 'ellipsis'
    }    
  }

  return type;
}

console.log(css);
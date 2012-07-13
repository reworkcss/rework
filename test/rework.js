
var rework = require('..')
  , fs = require('fs')
  , read = fs.readFileSync;

function fixture(name) {
  return read('test/fixtures/' + name + '.css', 'utf8');
}

describe('rework(css)', function(){
  describe('.prefix(prop, prefixes)', function(){
    it('should prefix properties', function(){
      rework(fixture('prefix'))
        .prefix('border-radius', ['-webkit-', '-moz-'])
        .toString()
        .should.equal(fixture('prefix.out'));
    })

    it('should prefix @keyframes', function(){
      var str = rework(fixture('keyframes'))
        .prefix('@keyframes', ['-webkit-', '-moz-'])
        .toString()
        .should.equal(fixture('keyframes.out'));
    })
  })
})
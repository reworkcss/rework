
var rework = require('..')
  , fs = require('fs')
  , read = fs.readFileSync;

function fixture(name) {
  return read('test/fixtures/' + name + '.css', 'utf8');
}

var vendors = ['-webkit-', '-moz-'];

describe('rework', function(){
  describe('.prefixValue(value)', function(){
    it('should prefix the value', function(){
      rework(fixture('prefix-value'))
        .use(rework.prefixValue('transform', vendors))
        .toString()
        .should.equal(fixture('prefix-value.out'));
    })

    it('should utilize .vendors()', function(){
      rework(fixture('prefix-value'))
        .vendors(vendors)
        .use(rework.prefixValue('transform'))
        .toString()
        .should.equal(fixture('prefix-value.out'));
    })
  })

  describe('.at2x()', function(){
    it('should add device-pixel-ratio rules', function(){
      rework(fixture('at2x'))
        .use(rework.at2x(vendors))
        .toString()
        .should.equal(fixture('at2x.out'));
    })

    it('should add vendor prefixed device-pixel-ratio rules', function(){
      rework(fixture('at2x-complex'))
        .use(rework.at2x(vendors))
        .toString()
        .should.equal(fixture('at2x-complex.out'));
    })
  })

  describe('.prefix(prop)', function(){
    it('should prefix prop', function(){
      rework(fixture('prefix'))
        .vendors(vendors)
        .use(rework.prefix('border-radius'))
        .use(rework.prefix('box-shadow'))
        .toString()
        .should.equal(fixture('prefix.out'));
    })
  })

  describe('.prefixSelectors(str)', function(){
    it('should prefix selectors', function(){
      rework(fixture('prefix-selectors'))
        .use(rework.prefixSelectors('#dialog'))
        .toString()
        .should.equal(fixture('prefix-selectors.out'));
    })
  })

  describe('.opacity()', function(){
    it('should add ie crap', function(){
      rework(fixture('opacity'))
        .vendors(vendors)
        .use(rework.opacity())
        .toString()
        .should.equal(fixture('opacity.out'));
    })
  })

  describe('.keyframes()', function(){
    it('should prefix keyframes', function(){
      rework(fixture('keyframes'))
        .vendors(vendors)
        .use(rework.keyframes())
        .use(rework.opacity())
        .use(rework.prefix('border-radius'))
        .toString()
        .should.equal(fixture('keyframes.out'));
    })
  })

  describe('.url(fn)', function(){
    it('should map urls', function(){
      function rewrite(url) {
        return 'http://example.com' + url;
      }

      rework(fixture('url'))
        .use(rework.url(rewrite))
        .toString()
        .should.equal(fixture('url.out'));
    })
  })
})

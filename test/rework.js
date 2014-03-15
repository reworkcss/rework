
var rework = require('..')
  , fs = require('fs')
  , assert = require('assert')
  , read = fs.readFileSync;

function fixture(name) {
  return read('test/fixtures/' + name + '.css', 'utf8').trim();
}

describe('rework', function(){
  describe('.properties', function(){
    it('should be vendor-prefixed properties', function(){
      assert(rework.properties);
    })
  })

  describe('visitor', function(){
    it('should work with charset, import, etc', function(){
      rework(fixture('charset'))
        .use(rework.extend())
        .toString().trim()
        .should.equal(fixture('charset.out'));
    })
  })

  describe('.extend()', function(){
    it('should allow extending rulesets', function(){
      rework(fixture('extend'))
      .use(rework.extend())
      .toString()
      .should.equal(fixture('extend.out'));
    })

    it('should support nested selectors', function(){
      rework(fixture('extend.nested'))
      .use(rework.extend())
      .toString()
      .should.equal(fixture('extend.nested.out').trim());
    })

    it('should support placeholder selectors', function(){
      rework(fixture('extend.nested.placeholder'))
      .use(rework.extend())
      .toString()
      .should.equal(fixture('extend.nested.placeholder.out').trim());
    })
  })

  describe('.at2x()', function(){
    it('should add device-pixel-ratio rules', function(){
      rework(fixture('at2x'))
        .use(rework.at2x())
        .toString()
        .should.equal(fixture('at2x.out'));
    })
  })

  describe('.ease()', function(){
    it('should add additional easing functions', function(){
      rework(fixture('easing'))
        .use(rework.ease())
        .toString()
        .should.equal(fixture('easing.out'));
    })
  })

  describe('.toString() compress option', function(){
    it('should compress the output', function(){
      rework('body { color: red; }')
        .toString({ compress: true })
        .should.equal('body{color:red;}');
    })
  })

  describe('.toString() sourcemap option', function() {
    it('should inline sourcemap', function() {
      rework('body { color: red; }')
        .toString({ compress: true, sourcemap: true })
        .should.equal(
          'body{color:red;}' + '\n' +
          '/*# sourceMappingURL=data:application/json;base64,' +
               'eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmNzc' +
               'yIsInNvdXJjZXMiOlsic291cmNlLmNzcyJdLCJuYW1lcy' +
               'I6W10sIm1hcHBpbmdzIjoiQUFBQSxLQUFPLFNBQVUifQ== */');
    })
  })

  describe('.toString() sourcemapAsObject and sourcemap options', function() {
    it('should return sourcemap as an object', function() {
      var result = rework('body { color: red; }')
        .toString({ compress: true, sourcemap: true, sourcemapAsObject: true });
      result.code.should.equal('body{color:red;}');
      result.map.should.have.property('mappings');
      result.map.mappings.should.equal('AAAA,KAAO,SAAU');
    })
  })
})


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

  describe('.colors()', function(){
    it('should support rgba(color, a)', function(){
      rework(fixture('colors'))
        .use(rework.colors())
        .toString()
        .should.equal(fixture('colors.out'));
    })

    it('should support hsb(hue, saturation, value)', function(){
      rework(fixture('colors.hsb'))
        .use(rework.colors())
        .toString()
        .should.equal(fixture('colors.hsb.out'));
    })
  })

  describe('.mixin(obj)', function(){
    it('should apply properties', function(){
      rework(fixture('mixins'))
        .use(rework.mixin({ overflow: ellipsis }))
        .toString().trim()
        .should.equal(fixture('mixins.out'));

      function ellipsis(type) {
        if ('ellipsis' == type) {
          return {
            'white-space': 'nowrap',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis'
          }
        }

        return {
          'overflow': type
        };
      }
    })

    it('should apply array properties', function(){
      rework(fixture('mixins.array'))
        .use(rework.mixin({ display: display }))
        .toString().trim()
        .should.equal(fixture('mixins.array.out'));

      function display(type) {
        if ('flex' == type) {
          return {
            display: [
              '-webkit-flex',
              '-moz-flex',
              '-webkit-flexbox',
              'flex'
            ]
          }
        }

        return {
          display: type
        }
      }
    })

    it('should allow multiple mixins to be used sequentially', function() {
      rework(fixture('mixins.multiple'))
        .use(rework.mixin({
          display: display,
          overflow: ellipsis
        }))
        .toString().trim()
        .should.equal(fixture('mixins.multiple.out'));

      function display(type) {
        if ('flex' == type) {
          return {
            display: [
              '-webkit-flex',
              '-moz-flex',
              '-webkit-flexbox',
              'flex'
            ]
          }
        }

        return {
          display: type
        }
      }

      function ellipsis(type) {
        if ('ellipsis' == type) {
          return {
            'white-space': 'nowrap',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis'
          }
        }

        return {
          'overflow': type
        };
      }
    });
  })

  describe('.references()', function(){
    it('should substitute @<word> with property values', function(){
      rework(fixture('references'))
        .use(rework.references())
        .toString()
        .should.equal(fixture('references.out'));
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

  describe('.prefixSelectors(str)', function(){
    it('should prefix selectors', function(){
      rework(fixture('prefix-selectors'))
        .use(rework.prefixSelectors('#dialog'))
        .toString()
        .should.equal(fixture('prefix-selectors.out'));
    })
    it('should use the prefix as the :root pseudo-class', function(){
      rework(fixture('prefix-selectors-root'))
        .use(rework.prefixSelectors('#dialog'))
        .toString()
        .should.equal(fixture('prefix-selectors-root.out'));
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

  describe('.ease()', function(){
    it('should add additional easing functions', function(){
      rework(fixture('easing'))
        .use(rework.ease())
        .toString()
        .should.equal(fixture('easing.out'));
    })
  })

  describe('.inline(dir)', function(){
   it('should inline images', function(){
     rework(fixture('inline'))
       .use(rework.inline('lib/', 'test/fixtures'))
       .toString()
       .should.equal(fixture('inline.out'));
   })

   it('should accept dirs in array', function(){
     rework(fixture('inline'))
       .use(rework.inline(['lib/', 'test/fixtures']))
       .toString()
       .should.equal(fixture('inline.out'));
   })

   it('should throw error on nonexistent file', function(){
     (function(){
       rework(fixture('inline'))
         .use(rework.inline())
         .toString()
     }).should.throw(/dot.png/)
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


var rework = require('..')
  , fs = require('fs')
  , read = fs.readFileSync;

function fixture(name) {
  return read('test/fixtures/' + name + '.css', 'utf8').trim();
}

var vendors = ['-webkit-', '-moz-'];

var media = {
  'phone': 'only screen and (min-device-width : 320px) and (max-device-width : 480px)',
  'phone-landscape': '@media only screen and (min-width : 321px)'
};

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

    it('should support gradients', function(){
      rework(fixture('gradients'))
        .vendors(vendors)
        .use(rework.prefixValue('linear-gradient'))
        .use(rework.prefixValue('radial-gradient'))
        .toString()
        .should.equal(fixture('gradients.out'));
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
  })

  describe('.mixin(obj)', function(){
    it('should apply mixins', function(){
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
        .use(rework.at2x(vendors))
        .toString()
        .should.equal(fixture('at2x.out'));
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

    it('should support an array of properties', function(){
      rework(fixture('prefix'))
        .vendors(vendors)
        .use(rework.prefix(['border-radius', 'box-shadow']))
        .toString()
        .should.equal(fixture('prefix.out'));
    })

    it('should visit @media', function(){
      rework(fixture('prefix.media'))
        .vendors(vendors)
        .use(rework.prefix('border-radius'))
        .toString()
        .should.equal(fixture('prefix.media.out'));
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

  describe('.vars()', function(){
    it('should add variable support', function(){
      rework(fixture('vars'))
        .vendors(vendors)
        .use(rework.vars())
        .toString()
        .should.equal(fixture('vars.out'));
    })
  })

  describe('.ease()', function(){
    it('should add additional easing functions', function(){
      rework(fixture('easing'))
        .vendors(vendors)
        .use(rework.ease())
        .toString()
        .should.equal(fixture('easing.out'));
    })
  })

  describe('.media(obj)', function(){
    it('should define media macros', function(){
      rework(fixture('media'))
        .use(rework.media(media))
        .toString()
        .should.equal(fixture('media.out'));
    })
  })

  describe('.toString() compress option', function(){
    it('should compress the output', function(){
      rework('body { color: red; }')
        .toString({ compress: true })
        .should.equal('body{color:red}');
    })
  })
})

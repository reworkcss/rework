
# rework

  CSS manipulations built on [node-css](github.com/visionmedia/node-css),
  allowing you to automate vendor prefixing, create your own properties,
  inline images, anything you can imagine!

## Installation

    $ npm install rework

## API

### rework(css)

  Return a new `Rework` instance for the given string of `css`.

### Rework#vendors(prefixes)

  Define vendor `prefixes` that plugins may utilize,
  however most plugins do and should accept direct passing
  of vendor prefixes as well.

### Rework#use(fn)

  Use the given plugin `fn`. A rework "plugin" is simply
  a function accepting the stylesheet object and `Rework` instance,
  view the definitions in `./lib/plugins` for examples.

### Rework#toString()

  Return the string representation of the manipulated css.

## Plugins

  The following plugins are bundled with `rework`:

### .at2x([vendors])

  Add retina support for images, with optional `vendor` prefixes,
  defaulting to `.vendors()`.

```css
logo {
  background-image: url('/public/images/logo.png')
}
```

yields:

```css
logo {
  background-image: url('/public/images/logo.png')
}

@media all and (-webkit-min-device-pixel-ratio : 1.5) {
  .logo {
    background-image: url("/public/images/logo@2x.png")
  }
}
```

### .prefix(property, [vendors])

  Prefix `property` with optional `vendors` defaulting to `.vendors()`.

```css
.button {
  border-radius: 5px;
}
```

yields:

```css
.button {
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}
```

### .prefixValue(value, [vendors])

  Prefix `value` with optional `vendors` defaulting to `.vendors()`.

```css
button {
  transition: height, transform 2s, width 0.3s linear;
}
```

yields:

```css
button {
  -webkit-transition: height, -webkit-transform 2s, width 0.3s linear;
  -moz-transition: height, -moz-transform 2s, width 0.3s linear;
  transition: height, transform 2s, width 0.3s linear
}
```

### .opacity()

  Add IE opacity support.

```css
ul {
  opacity: 1 !important;
}
```

yields:

```css
ul {
  opacity: 1 !important;
  -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100) !important;
  filter: alpha(opacity=100) !important
}
```

### .keyframes([vendors])

  Prefix __@keyframes__ with `vendors` defaulting to `.vendors()`.
  Ordering with `.keyframes()` is important, as other plugins
  may traverse into the newly generated rules, for example the
  following will allow `.prefix()` to prefix keyframe `border-radius`
  property, `.prefix()` is also smart about which keyframes definition
  it is within, and will not add extraneous vendor definitions.

```js
var css = rework(read('examples/keyframes.css', 'utf8'))
  .vendors(['-webkit-', '-moz-'])
  .use(rework.keyframes())
  .use(rework.prefix('border-radius'))
  .toString()
```

```css
@keyframes animation {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
```

yields:

```css
@keyframes animation {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@-webkit-keyframes animation {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
```

## Example

example.js:

```js
var rework = require('rework')
  , read = require('fs').readFileSync
  , str = read('example.css', 'utf8');

var css = rework(str)
  .vendors(['-webkit-', '-moz-'])
  .use(rework.keyframes())
  .use(rework.prefix('border-radius'))
  .toString()

console.log(css);
```

example.css:

```css
@keyframes animation {
  from { opacity: 0; border-radius: 5px }
  to { opacity: 1; border-radius: 5px }
}
```

stdout:

```css
@keyframes animation {
  from {
    opacity: 0;
    border-radius: 5px
  }

  to {
    opacity: 1;
    border-radius: 5px
  }
}

@-webkit-keyframes animation {
  from {
    opacity: 0;
    -webkit-border-radius: 5px;
    border-radius: 5px
  }

  to {
    opacity: 1;
    -webkit-border-radius: 5px;
    border-radius: 5px
  }
}

@-moz-keyframes animation {
  from {
    opacity: 0;
    -moz-border-radius: 5px;
    border-radius: 5px
  }

  to {
    opacity: 1;
    -moz-border-radius: 5px;
    border-radius: 5px
  }
}
```

## Example Plugin

  Suppose for example you wanted to create your own
  properties for positions, allowing you to write
  them as follows:

```css

#logo {
  absolute: top left;
}

#logo {
  relative: top 5px left;
}

#logo {
  fixed: top 5px left 10px;
}
```

yielding:

```css
#logo {
  position: absolute;
  top: 0;
  left: 0
}

#logo {
  position: relative;
  top: 5px;
  left: 0
}

#logo {
  position: fixed;
  top: 5px;
  left: 10px
}
```

 This is how you could define the plugin:

```js

var rework = require('rework')
  , read = require('fs').readFileSync;

function positions() {
  var positions = ['absolute', 'relative', 'fixed'];

  return function(style){
    style.rules.forEach(function(rule){
      rule.declarations.forEach(function(decl, i){
        if (!~positions.indexOf(decl.property)) return;
        var args = decl.value.split(/\s+/);
        var arg, n;

        // remove original
        rule.declarations.splice(i, 1);

        // position prop
        rule.declarations.push({
          property: 'position',
          value: decl.property
        });

        // position
        while (args.length) {
          arg = args.shift();
          n = parseFloat(args[0]) ? args.shift() : 0;
          rule.declarations.push({
            property: arg,
            value: n
          });
        }
        
      });
    });
  }
}

var css = rework(read('positions.css', 'utf8'))
  .use(positions())
  .toString()

console.log(css);
```

## License 

(The MIT License)

Copyright (c) 2012 TJ Holowaychuk &lt;tj@vision-media.ca&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
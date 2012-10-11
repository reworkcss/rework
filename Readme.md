# rework

  CSS manipulations built on [node-css](//github.com/visionmedia/node-css),
  allowing you to automate vendor prefixing, create your own properties,
  inline images, anything you can imagine!

## Installation

with node:

    $ npm install rework

or in the browser:

    $ component install visionmedia/rework

## rework(1)

```js

Usage: rework [options]

Options:

  -h, --help            output usage information
  -V, --version         output the version number
  -v, --vendors <list>  specify list of vendors

```

for example:

```
$ rework -v webkit,moz < my.css > my.reworked.css
```

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

### Rework#toString(options)

  Return the string representation of the manipulated css. Optionally
  you may compress the output with `.toString({ compress: true })`

## Plugins

  The following plugins are bundled with `rework`:

### .ease()

  Adds the following list of additional easing functions:

  - `ease-in-out-back` -- `cubic-bezier(0.680, -0.550, 0.265, 1.550)`
  - `ease-in-out-circ` -- `cubic-bezier(0.785, 0.135, 0.150, 0.860)`
  - `ease-in-out-expo` -- `cubic-bezier(1.000, 0.000, 0.000, 1.000)`
  - `ease-in-out-sine` -- `cubic-bezier(0.445, 0.050, 0.550, 0.950)`
  - `ease-in-out-quint` -- `cubic-bezier(0.860, 0.000, 0.070, 1.000)`
  - `ease-in-out-quart` -- `cubic-bezier(0.770, 0.000, 0.175, 1.000)`
  - `ease-in-out-cubic` -- `cubic-bezier(0.645, 0.045, 0.355, 1.000)`
  - `ease-in-out-quad` -- `cubic-bezier(0.455, 0.030, 0.515, 0.955)`
  - `ease-out-back` -- `cubic-bezier(0.175, 0.885, 0.320, 1.275)`
  - `ease-out-circ` -- `cubic-bezier(0.075, 0.820, 0.165, 1.000)`
  - `ease-out-expo` -- `cubic-bezier(0.190, 1.000, 0.220, 1.000)`
  - `ease-out-sine` -- `cubic-bezier(0.390, 0.575, 0.565, 1.000)`
  - `ease-out-quint` -- `cubic-bezier(0.230, 1.000, 0.320, 1.000)`
  - `ease-out-quart` -- `cubic-bezier(0.165, 0.840, 0.440, 1.000)`
  - `ease-out-cubic` -- `cubic-bezier(0.215, 0.610, 0.355, 1.000)`
  - `ease-out-quad` -- `cubic-bezier(0.250, 0.460, 0.450, 0.940)`
  - `ease-in-back` -- `cubic-bezier(0.600, -0.280, 0.735, 0.045)`
  - `ease-in-circ` -- `cubic-bezier(0.600, 0.040, 0.980, 0.335)`
  - `ease-in-expo` -- `cubic-bezier(0.950, 0.050, 0.795, 0.035)`
  - `ease-in-sine` -- `cubic-bezier(0.470, 0.000, 0.745, 0.715)`
  - `ease-in-quint` -- `cubic-bezier(0.755, 0.050, 0.855, 0.060)`
  - `ease-in-quart` -- `cubic-bezier(0.895, 0.030, 0.685, 0.220)`
  - `ease-in-cubic` -- `cubic-bezier(0.550, 0.055, 0.675, 0.190)`
  - `ease-in-quad` -- `cubic-bezier(0.550, 0.085, 0.680, 0.530)`

  To view them online visit [easings.net](http://easings.net/).

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

@media all and (-webkit-min-device-pixel-ratio: 1.5) {
  .logo {
    background-image: url("/public/images/logo@2x.png")
  }
}
```

### .prefix(property|properties, [vendors])

  Prefix `property` or array of `properties` with optional `vendors` defaulting to `.vendors()`.

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

### .prefixSelectors(string)

  Prefix selectors with the given `string`.

```css
h1 {
  font-weight: bold;
}

a {
  text-decoration: none;
  color: #ddd;
}
```

yields:

```css
#dialog h1 {
  font-weight: bold;
}

#dialog a {
  text-decoration: none;
  color: #ddd;
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

### .url(callback)

  Map `url()` calls, useful for inlining images as data-uris, converting
  relative paths to absolute etc.

```js
function rewrite(url) {
  return 'http://example.com' + url;
}

rework(str)
  .use(rework.url(rewrite))
  .toString()
```

### .vars()

  Add variable support. Note that this does not cascade like the CSS variable
  spec does, thus this is _not_ some sort of fallback mechanism, just a useful
  feature.

```css
:root {
  var-header-color: #06c;
  var-main-color: #c06;
}

div {
  var-accent-background: linear-gradient(to top, var(main-color), white);
}

h1 {
  background-color: var(header-color);
}

.content {
  background: var(accent-background) !important;
}
```

  yields:

```css
:root {
  var-header-color: #06c;
  var-main-color: #c06
}

div {
  var-accent-background: linear-gradient(to top, #c06, white)
}

h1 {
  background-color: #06c
}

.content {
  background: linear-gradient(to top, #c06, white) !important
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

## Links

  - Nodejitsu rework [web service](http://rework.jit.su/) 

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
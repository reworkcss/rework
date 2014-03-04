# rework [![Build Status](https://travis-ci.org/reworkcss/rework.png)](https://travis-ci.org/visionmedia/rework)

  CSS manipulations built on [css](https://github.com/visionmedia/css),
  allowing you to automate vendor prefixing, create your own properties,
  inline images, anything you can imagine! Also works in the browser as
  a [component](https://github.com/component/component).

## Installation

with node:

    $ npm install rework

or in the browser with component:

    $ component install visionmedia/rework

or in the browser with the stand-alone build ./rework.js referencing the `rework` global.

## Links

  - [rework mixins](https://github.com/visionmedia/rework-mixins)
  - [significant whitespace](https://github.com/visionmedia/css-whitespace) - nested and indented syntax like Stylus and SASS
  - third-party [plugins and utilities](https://github.com/visionmedia/rework/wiki/Plugins-and-Utilities)

## Built with rework

  - [styl](https://github.com/visionmedia/styl) - CSS preprocessor built on Rework
  - [autoprefixer](https://github.com/ai/autoprefixer) - prefixer based on the Can I Use database
  - [rework-pure-css](https://github.com/ianstormtaylor/rework-pure-css) - bleeding-edge, spec-compliant CSS
  - [rework-suit](https://github.com/suitcss/rework-suit) - CSS preprocessor for SUIT
  - [resin](https://github.com/topcoat/resin) - Opinionated CSS preprocessor for Topcoat
  - [Myth] (https://github.com/segmentio/myth) -  CSS preprocessor built using Rework

## API

### rework(css)

  Return a new `Rework` instance for the given string of `css`.

### Rework#use(fn)

  Use the given plugin `fn`. A rework "plugin" is simply
  a function accepting the stylesheet object and `Rework` instance,
  view the definitions in `./lib/plugins` for examples.

### Rework#toString(options)

  Return the string representation of the manipulated css. Optionally
  you may compress the output with `.toString({ compress: true })` and/or generate an inline source map with `.toString({ sourcemap: true })`

## Plugins

  The following plugins are bundled with `rework`:

  - [extend](#extend) — add `extend: selector` support
  - [ease](#ease) — several additional easing functions
  - [at2x](#at2x) — serve high resolution images
  - [prefixSelectors](#prefixselectorsstring) — add prefixes to selectors
  - [colors](#colors) — add colour helpers like `rgba(#fc0, .5)`
  - [mixin](#mixinobject) — add custom property logic with mixing
  - [function](#functionobject) — Add user-defined CSS functions
  - [references](#references) — add property references support `height: @width` etc
  - [url](#urlfn) - rewrite `url()`s with a given function
  - third-party [plugins](https://github.com/visionmedia/rework/wiki/Plugins-and-Utilities)

### .extend()

  Add support for extending existing rulesets:

```css

button {
  padding: 5px 10px;
  border: 1px solid #eee;
  border-bottom-color: #ddd;
}

.green {
  background: green;
  padding: 10px 15px
}

a.join {
  extend: button;
  extend: .green;
}

a.button,
input[type='submit'],
input[type='button'] {
  extend: button
}
```

yields:

```css

button,
a.button,
input[type='submit'],
input[type='button'],
a.join {
  padding: 5px 10px;
  border: 1px solid #eee;
  border-bottom-color: #ddd;
}

.green,
a.join {
  background: green;
  padding: 10px 15px
}
```

  Optionally selectors may be prefixed with `%` to create sass-style "placeholder"
  selectors, which do not become part of the output. For example:

```css
%dark-button {
  background: black;
}

%dark-button:hover {
  background: rgba(0,0,0,.5);
}

%dark-button:hover .icon {
  color: rgba(255,255,255,.5);
}

button,
.actions a {
  extend: %dark-button;
  padding: 5px 10px;
}
```

yields:

```css
button,
.actions a {
  background: black
}

button:hover,
.actions a:hover {
  background: rgba(0,0,0,.5)
}

button:hover .icon,
.actions a:hover .icon {
  color: rgba(255,255,255,.5)
}

button,
.actions a {
  padding: 5px 10px
}
```

This plugin is stored in its own repo at [jonathanong/rework-inherit](https://github.com/jonathanong/rework-inherit).
Please delegate any issues with `.extend()` to that repository instead of rework.

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

### .at2x()

  Adds `at-2x` keyword to `background` and `background-image`
  declarations to add retina support for images.

```css
.logo {
  background-image: url('component.png') at-2x;
  width: 289px;
  height: 113px
}
```

yields:

```css
.logo {
  background-image: url('component.png');
  width: 289px;
  height: 113px
}

@media all and (-webkit-min-device-pixel-ratio: 1.5) {
  .logo {
    background-image: url("component@2x.png");
    background-size: contain
  }
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

### .mixin(object)

  Add user-defined mixins, functions that are invoked for a given property, and
  passed the value. Returning an object that represents one or more properties.

  For example the following `overflow` mixin allows the designer
  to utilize `overflow: ellipsis;` to automatically assign associated
  properties preventing wrapping etc.

  The receiver (`this`) is the `Rework` instance, allowing the mixin to reference
  properties such as the vendor `.prefixes` array.

```js
var css = rework(css)
  .use(rework.mixin({ overflow: ellipsis }))
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
```

  Mixins in use look just like regular CSS properties:

```css

h1 {
  overflow: ellipsis;
}
```

yields:

```css
h1 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis
}
```

  You may also return array values to expand to several definitions of the property:

```
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
```

  Would yield:

```css
.myclass {
  display: -webkit-flex;
  display: -moz-flex;
  display: -webkit-flexbox;
  display: flex;
}
```

### .function(object)

  Add user-defined CSS functions.

  For example create `black(0.5)` shortcut, to replace
  long `rgba(0, 0, 0, 0.5)`.

```js
var css = rework(css)
  .use(rework.function({ black: black }))
  .toString()

function black(opacity) {
  return 'rgba(0, 0, 0, ' + opacity + ')';
}
```

  User code will receive CSS arguments and replace user-defined function
  by returned code.

```css
input {
  box-shadow: 0 0 5px black(0.7);
}
```

yields:

```css
input {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
}
```

  Nested functions works well too:

```javascript
var css = rework(css)
  .use(rework.function(
    subtract: function(a, b) { return a - b },
    multiply: function(a, b) { return a * b },
    divide: function(a, b) { return a / b },
    floor: Math.floor
  ))
  .toString()
```

```css
input {
  top: divide(subtract(30, floor(multiply(20, 10))), 2);
}
```

  Would yield:

```css
input {
  top: -85;
}
```

### .references()

  Add property reference support.

```css
button {
  width: 120px;
}

button.round {
  width: 50px;
  height: @width;
  line-height: @height;
  background-size: @width @height;
}
```

yields:

```css
button {
  width: 120px
}

button.round {
  width: 50px;
  height: 50px;
  line-height: 50px;
  background-size: 50px 50px
}
```

### .colors()

  Add color manipulation helpers such as `rgba(#fc0, .5)`.

```css
button {
  background: rgba(#ccc, .5);
}
```

yields:

```css
button {
  background: rgba(204, 204, 204, .5);
}
```

### .inline(dir)

  Inline files from `dir` directly to CSS. Replace `inline(path)` to Data URI
  with base64 encoding of file. It is useful for small images and fonts.

  Of course, you can use inline only with node. It is not available
  in the browser with component.

```js
var css = rework(read(css))
  .use(rework.inline('images/', 'fonts/'))
  .toString()
```

```css
.logo {
  background: inline(icons/logo.png);
}
```

yields:

```css
.logo {
  background: url("data:image/png;base64,iVBORw0…");
}
```

### .url(fn)

  Map `url()` calls. Replace all `url()`s using a given function.

```js
var css = rework(read(css))
  .use(rework.url(function(url){
    return 'http://example.com' + url;
  }))
  .toString()
```

```css
body {
  background: url(/images/bg.png);
}
```

yields:

```css
body {
  background: url(http://example.com/images/bg.png);
}
```

## License

(The MIT License)

Copyright (c) 2012 - 2013 TJ Holowaychuk <tj@vision-media.ca>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

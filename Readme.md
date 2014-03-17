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

  Rework no longer bundles plugins. Formerly bundled plugins are linked below:

  - [extend](https://github.com/reworkcss/rework-inherit/) — add `extend: selector` support
  - [ease](https://github.com/reworkcss/rework-ease/) — several additional easing functions
  - [at2x](https://github.com/reworkcss/rework-plugin-at2x/) — serve high resolution images
  - [prefixSelectors](https://github.com/reworkcss/rework-plugin-prefix-selectors) — add prefixes to selectors
  - [colors](https://github.com/reworkcss/rework-plugin-colors/) — add colour helpers like `rgba(#fc0, .5)`
  - [mixin](https://github.com/reworkcss/rework-plugin-mixin/) — add custom property logic with mixing
  - [function](https://github.com/reworkcss/rework-plugin-function/) — Add user-defined CSS functions
  - [references](https://github.com/reworkcss/rework-plugin-references/) — add property references support `height: @width` etc
  - [url](https://github.com/reworkcss/rework-plugin-url/) - rewrite `url()`s with a given function
  - third-party [plugins](https://github.com/visionmedia/rework/wiki/Plugins-and-Utilities)


## License

(The MIT License)

Copyright (c) 2012 - 2013 TJ Holowaychuk <tj@vision-media.ca>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

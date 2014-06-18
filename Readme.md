# rework [![Build Status](https://travis-ci.org/reworkcss/rework.png)](https://travis-ci.org/reworkcss/rework)

CSS manipulations built on [css](https://github.com/reworkcss/css), allowing
you to automate vendor prefixing, create your own properties, inline images,
anything you can imagine!

Please refer to [css](https://github.com/reworkcss/css) for AST documentation
and to report parser/stringifier issues.

## Installation

```
$ npm install rework
```

## Built with rework

- [styl](https://github.com/visionmedia/styl) - CSS preprocessor built on Rework
- [rework-pure-css](https://github.com/ianstormtaylor/rework-pure-css) - bleeding-edge, spec-compliant CSS
- [rework-suit](https://github.com/suitcss/rework-suit) - CSS preprocessor for SUIT
- [resin](https://github.com/topcoat/resin) - Opinionated CSS preprocessor for Topcoat
- [Myth] (https://github.com/segmentio/myth) -  CSS preprocessor built using Rework

## API

### rework(css)

Return a new `Rework` instance for the given string of `css`.

### Rework#use(fn)

Use the given plugin `fn`. A rework "plugin" is simply a function accepting the
stylesheet object and `Rework` instance.

### Rework#toString(options)

Return the string representation of the manipulated css. Optionally you may
compress the output with `.toString({ compress: true })` and/or generate an
inline source map with `.toString({ sourcemap: true })`

## Plugins

Rework has a rich collection of plugins and mixins. Browse all the [Rework
plugins](https://www.npmjs.org/search?q=rework) available on npm.

Plugins of particular note:

- [at2x](https://github.com/reworkcss/rework-plugin-at2x/) — serve high resolution images
- [calc](https://github.com/reworkcss/rework-calc) - resolve simple `calc()` expressions
- [colors](https://github.com/reworkcss/rework-plugin-colors/) — add colour helpers like `rgba(#fc0, .5)`
- [ease](https://github.com/reworkcss/rework-plugin-ease/) — several additional easing functions
- [extend](https://github.com/reworkcss/rework-inherit/) — add `extend: selector` support
- [function](https://github.com/reworkcss/rework-plugin-function/) — Add user-defined CSS functions
- [import](https://github.com/reworkcss/rework-import) - read and inline css via `@import`
- [inline](https://github.com/reworkcss/rework-plugin-inline) - inline assets as dataURI with base64 encoding
- [mixin](https://github.com/reworkcss/rework-plugin-mixin/) — add custom property logic with mixing
- [references](https://github.com/reworkcss/rework-plugin-references/) — add property references support `height: @width` etc
- [significant whitespace](https://github.com/reworkcss/css-whitespace) - nested and indented syntax like Stylus and SASS
- [url](https://github.com/reworkcss/rework-plugin-url/) - rewrite `url()`s with a given function
- [variables](https://github.com/reworkcss/rework-vars/) - W3C-style variables

## License

(The MIT License)

Copyright (c) 2012 - 2013 TJ Holowaychuk <tj@vision-media.ca>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


# rework

  CSS manipulations built on CSSOM.

  Still a WIP, CSSOM needs a few patches aka this will break ATM.

## Example

style.css:

```css
@keyframes round {
  from { border-radius: 5px }
  to { border-radius: 10px }
}

.title {
  font-size: 18px;
  padding: 5px;
}

.close {
  position: absolute;
  top: 5px;
  right: 5px;
}
```

example.js:

```js
var rework = require('rework')
  , fs = require('fs')
  , read = fs.readFileSync;

var vendors = ['-webkit-', '-moz-'];

var css = rework(read('examples/sink.css', 'utf8'))
  .prefix('border-radius', vendors)
  .prefix('@keyframes', vendors)
  .prefix('#dialog')
  .toString();

console.log(css);
```

stdout:

```css
@keyframes round { 
  from { border-radius: 5px; } 
  to { border-radius: 10px; } 
}
@-moz-keyframes round { 
  from { border-radius: 5px; -moz-border-radius: 5px; } 
  to { border-radius: 10px; -moz-border-radius: 10px; } 
}
@-webkit-keyframes round { 
  from { border-radius: 5px; -webkit-border-radius: 5px; } 
  to { border-radius: 10px; -webkit-border-radius: 10px; } 
}
#dialog .title {font-size: 18px; padding: 5px;}
#dialog .close {position: absolute; top: 5px; right: 5px;}
```

## API

### .prefix(string)

  Prefix selectors with `string`.

```js
.prefix('#dialog')
```

### .prefix(property, prefixes)

  Apply vendor `prefixes` array to occurrences of `property`.

```js
.prefix('border-radius', ['-webkit-', '-moz-'])
```

### .prefixes("@keyframes", prefixes)

  Apply vendor `prefixes` array to __@keyframes__.

```js
.prefix('@keyframes', ['-webkit-', '-moz-'])
```

### .mapSelectors(callback)

  Map selector strings using the given `callback`.

```js
.mapSelectors(function(sel){
  return '#dialog ' + sel;
})
```

## CLI

```

Usage: rework [options]

Options:

  -h, --help                output usage information
  -v, --vendors <prefixes>  use vendor <prefixes>
  -p, --prefix <props>      prefix occurrances of <props>
  -V, --version

```

## License 

(The MIT License)

Copyright (c) 2012 Learnboost &lt;tj@vision-media.ca&gt;

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

0.20.3 / 2014-05-08
==================

 * Using updated rework-inherit
 * Update repo URL and add keywords
 * Merge pull request #143 from lennart/master
 * Fixed Travis CI
 * Merge pull request #142 from joliss/commander
 * Remove unused commander dependency
 * Merge pull request #140 from bclinkinbeard/patch-1
 * Update Readme.md to document sourcemap option
 * Merge pull request #138 from ericf/patch-1
 * Unignore /rework.js so it's in the npm package

0.20.2 / 2014-01-02
===================

 * fix prefix-selector support for :root pseudo-class
 * fix rework.js

0.20.1 / 2013-12-23
===================

 * fix last tag. please ignore 0.20.0. thank you for your cooperation.

0.20.0 / 2013-12-23
===================

 * update css
 * add sourcemap option to .toString() - see [#123](https://github.com/visionmedia/rework/pull/123)

0.19.0 / 2013-12-22
===================

 * remove all vendor support. See: [#126](https://github.com/visionmedia/rework/issues/126).

     * deprecated .vendors()
     * remove .prefix()
     * remove .prefixValue()
     * remove .keyframes()
     * remove .properties

 * function: support nested functions #119 @bolasblack
 * at-2x: now requires a `at-2x` tag. #121 @rschmukler

0.18.3 / 2013-10-18
==================

 * update css for css-stringify compress fixes

0.18.2 / 2013-10-16
==================

 * update css dep
 * bump rework-inherit

0.18.1 / 2013-09-03
==================

 * extract hsb2rgb() as a separate npm module

0.18.0 / 2013-09-02
==================

 * add HSV/HSB to RGB function "hsb()"

0.17.4 / 2013-08-22
==================

 * add more to the at2x media query
 * comment out inline() tests

0.17.3 / 2013-07-28
==================

 * update css

0.17.2 / 2013-07-10
==================

 * fix references preceeded by punctuation. Closes #106

0.17.1 / 2013-07-03
==================

 * fix mixins skipping the next declaration

0.17.0 / 2013-06-18
==================

 * add this == Rework to mixin functions. Closes #101
 * update css
 * remove .vars() plugin. Closes #77
 * move visitor into rework-visit

0.16.0 / 2013-06-12
==================

 * add mixin property array support. Closes #80
 * change rework.extend to use rework-inherit
 * pin path version
 * fix: ignore comments in all plugins
 * fix: references in strings (`"foo@2x"` etc)

0.15.0 / 2013-06-01
==================

 * remove opacity plugin. Closes #29
 * remove media macros. Closes #36
 * update css
 * update css
 * fix data uris in .url(), .function() too greed with argument splitting. Closes #81
 * fix easing functions with animation and timing properties. Closes #83
 * remove rework(1) executable, use https://github.com/visionmedia/styl

0.14.0 / 2013-04-10
==================

  * add `rework.inline()` to encode images to base64
  * add `rework.function(obj)`
  * add var(object) support
  * add rework.properties array
  * remove unprefixed CSS3 properties
  * update css
  * fix colors() when multiple rgba() calls are in one property value

0.13.2 / 2013-02-28
==================

  * add ./rework.js stand-alone build
  * refactor positions example with visitor

0.13.1 / 2013-02-26
==================

  * fix visitor with @charset, @import etc

0.13.0 / 2013-02-26
==================

  * refactor url() with visitor
  * refactor references() with visitor
  * refactor prefixValue() with visitor
  * refactor mixin with visitor
  * refactor ease plugin with visitor
  * refactor colors plugin with visitor
  * add visit.declarations() helper

0.12.2 / 2013-02-12
==================

  * add prefix visiting for @media
  * add column props (fixes #26)

0.12.1 / 2013-02-08
==================

  * fix mixins plugin traversal

0.12.0 / 2013-01-16
==================

  * add placeholder selector support

0.11.0 / 2013-01-16
==================

  * fix extend nesting. Closes #22
  * fix hyphenated property references. Closes #20

0.10.2 / 2012-12-14
==================

  * fix .svg at2x. Closes #17
  * add gradients to rework(1)

0.10.1 / 2012-12-11
==================

  * fix named color support

0.10.0 2012-12-10
==================

  * add .mixin -> .mixins alias
  * add debug to component.json
  * add `extends` support

0.9.2 / 2012-12-05
==================

  * revert broken @2x media query implementation

0.9.1 / 2012-12-04
==================

  * fix rgba() with arity > 2

0.9.0 / 2012-11-30
==================

  * add mixin support
  * add property reference support
  * add rgba(color, a) plugin
  * add gradient support. Closes #12

0.8.0 / 2012-11-21
==================

  * add media macros. Closes #10
  * add background-size: contain to at2x

0.7.0 / 2012-10-10
==================

  * add `--ease` to rework(1)
  * add `.ease()` plugin for additional easing functions

0.6.1 / 2012-10-06
==================

  * add --vars to rework(1)
  * add web service link

0.6.0 / 2012-10-06
==================

  * add `.prefix(props)` array support. Closes #1
  * add variables plugin. Closes #5
  * increase perf ~40% faster for `rework(1)` pass

0.5.1 / 2012-09-18
==================

  * add visiting of `@media` nodes for `url()`
  * add `/g` flag to `url()`

0.5.0 / 2012-09-17
==================

  * add `.toString({ compress: true })` support

0.4.1 / 2012-09-17
==================

  * update css dep

0.4.0 / 2012-09-17
==================

  * add `url()` mapping plugin

0.3.0 / 2012-09-06
==================

  * add `rework(1)`. Closes #4

0.2.0 / 2012-09-04
==================

  * add vendor support to at2x [Simen Brekken]

0.1.2 / 2012-09-01
==================

  * add component "path" dep

0.1.1 / 2012-09-01
==================

  * add component support

0.1.0 / 2012-09-01
==================

  * add .prefixSelectors(str) plugin

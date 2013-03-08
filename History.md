
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

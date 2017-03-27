# QLite

A little library to operate DOM like jQuery, as a subset of jQuery.

## Why

- jQuery is thriftless as its size and several less used functions.
- Zepto updates slowly, and leaves [unsolved issues](https://github.com/madrobby/zepto/issues).
- Focus one thing, keey a tiny core to operate DOM, without collection operation, animation, network and something else. 
> For example, I hope to separate Ajax to use [fetch](https://github.com/github/fetch)/[axios](https://github.com/mzabriskie/axios) instead.

## API

- QLite

## TODO

- addClass/removeClass/hasClass/toggleClass
- before/after
- append/appendTo/prepend/prependTo
- val/attr/prop/data/removeAttr/removeProp/removeData
- on/off/one
- children/contents
- css
- ready
- remove
- width/height/innerWidth/innerHeight
- insertBefore/insertAfter
- offset/offsetParent
- position
- prev/next/siblings
- scrollLeft/scrollTop

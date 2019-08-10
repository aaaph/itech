// kk.js | Copyright 2013 Evan Moran | MIT License
;(function(){
  var root = this,

  kk = function(){
    _e('not yet implemented')
  }

  kk.version = '0.0.1'

  if (typeof module !== 'undefined' && module.exports) {
    // Export to node
    module.exports = kk
  } else {
    // Export globally
    root.kk = kk
  }

  // _d(args...): returns first arg that isn't null
  function _d(){
    for (var ix = 0;ix < arguments.length; ix++)
      if (arguments[ix] != null)
        return arguments[ix]
    return null
  }

  // _e: error by throwing msg with optional fn name
  function _e(fn, msg){
    msg = _d(msg, fn, '')
    fn = _d(fn, 0)
    var pfx = "kk: "
    if (fn)
      pfx = "kk." + fn + ": "
    throw new Error(pfx + msg)
  }

  // _a: assert when cond is false with msg and with optional fn name
  function _a(cond, fn, msg){if (!cond) _e(fn,msg)}


})(this);
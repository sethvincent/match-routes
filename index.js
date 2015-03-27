var url = require('url')
var extend = require('extend')

module.exports = function () {
  var hash = require('http-hash')()
  var router = { hash: hash }

  router.on = router.set = function route (name, handler) {
    return hash.set(name, handler)
  }

  router.match = function match (req, res, opts) {
    var parsedUrl = url.parse(req.url)
    var pathname = parsedUrl.pathname
    var route = hash.get(pathname)

    if (!route.handler) return false

    opts = extend(opts, {
      params: route.params,
      splat: route.splat,
      parsedUrl: parsedUrl
    })

    route.handler(req, res, opts)
    return true
  }

  return router
}
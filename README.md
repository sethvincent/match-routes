# match-routes

a simple server-side router based on [http-hash](https://github.com/Matt-Esch/http-hash).

## api


### router.set(path, callback)

`callback` is called with three arguments, `req`, `res`, and `options`

`options` includes `params`, `splats`, and `parsedUrl` objects

Example:

```
router.set('/', function (req, res, options) {
  console.log(options)
})
```

### router.match(req, res, opts)

```
http.createServer(function (req, res) {
  router.match(req, res)
})
```

## example usage

```
var http = require('http')
var response = require('response')
var router = require('./index')()

router.set('/', function (req, res, options) {
  response().html('this route exists').pipe(res)
})

var server = http.createServer(function (req, res) {
  if (router.match(req, res)) return
  
  response().html('this route does not exist').pipe(res)
})

server.listen(8989)
```

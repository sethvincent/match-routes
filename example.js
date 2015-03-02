var http = require('http')
var response = require('response')
var router = require('./index')()

router.set('/', function (req, res, opts) {
  response().html('this route exists').pipe(res)
})

var server = http.createServer(function (req, res) {
  if (router.match(req, res)) return
  
  response().html('this route does not exist').status(404).pipe(res)
})

server.listen(8989)

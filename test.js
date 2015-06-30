var test = require('tape')
var http = require('http')
var makeRequest = require('test-server-request')

var matchRoutes = require('./index.js')

test('is function', function t(t) {
  t.equal(typeof matchRoutes, 'function')
  t.end()
})

test('can request multiple urls', function t(t) {
  var router = matchRoutes()
  var server = http.createServer(defaultHandler(router))
  server.listen(0)

  router.on('/foo', function foo(req, res) {
    res.end('foo')
  })
  
  router.on('/bar', function bar(req, res) {
    res.end('bar')
  })

  makeRequest(server, {
    url: '/foo'
  }, function onResp(err, resp) {
    t.ifError(err)

    t.equal(resp.statusCode, 200)
    t.equal(resp.body, 'foo')

    makeRequest(server, {
      url: '/bar'
    }, function onResp(err, resp) {
      t.ifError(err)

      t.equal(resp.statusCode, 200)
      t.equal(resp.body, 'bar')

      server.close()
      t.end()
    })
  })
})

test('supports params', function t(t) {
  var router = matchRoutes()
  var server = http.createServer(defaultHandler(router))
  server.listen(0)

  router.on('/:foo', function onFoo(req, res, opts) {
    res.end(opts.params.foo)
  })

  makeRequest(server, {
    url: '/bar'
  }, function onResp(err, resp) {
    t.ifError(err)

    t.equal(resp.statusCode, 200)
    t.equal(resp.body, 'bar')

    server.close()
    t.end()
  })
})

test('supports splats', function t(t) {
  var router = matchRoutes()
  var server = http.createServer(defaultHandler(router))
  server.listen(0)

  router.on('/*', function onFoo(req, res, opts) {
    res.end(JSON.stringify(opts.splat))
  })

  makeRequest(server, {
    url: '/huh'
  }, function onResp(err, resp) {
    t.ifError(err)

    t.equal(resp.statusCode, 200)
    t.equal(resp.body, '"huh"')

    server.close()
    t.end()
  })
})

test('url is parsed', function (t) {
  var router = matchRoutes()
  var server = http.createServer(defaultHandler(router))
  server.listen(0)

  router.on('/oh/:id', function onFoo(req, res, opts) {
    console.log(opts)
    t.equal(opts.pathname, '/oh/awesome')
    t.equal(opts.path, '/oh/awesome')
    t.equal(opts.href, '/oh/awesome')
    t.deepEqual(opts.params, { id: 'awesome' })
    res.end()
  })

  makeRequest(server, { url: '/oh/awesome#cool' }, function onResp(err, resp) {
    t.ifError(err)
    server.close()
    t.end()
  })
})

function defaultHandler(router) {
  return function handler(req, res) {
    router.match(req, res, {}, function onError(err) {
      if (err) {
        res.statusCode = err.statusCode || 500
        res.end(err.message)
      }
    })
  }
}
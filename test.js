var test = require('tape');
var http = require('http');
var makeRequest = require('test-server-request');

var matchRoutes = require('./index.js');

test('is function', function t(assert) {
    assert.equal(typeof matchRoutes, 'function');
    assert.end();
});

test('can request multiple urls', function t(assert) {
    var router = matchRoutes();
    var server = http.createServer(defaultHandler(router));
    server.listen(0);

    router.set('/foo', function foo(req, res) {
        res.end('foo');
    });
    
    router.set('/bar', function bar(req, res) {
        res.end('bar');
    });

    makeRequest(server, {
        url: '/foo'
    }, function onResp(err, resp) {
        assert.ifError(err);

        assert.equal(resp.statusCode, 200);
        assert.equal(resp.body, 'foo');
        console.log()
        makeRequest(server, {
            url: '/bar'
        }, function onResp(err, resp) {
            assert.ifError(err);

            assert.equal(resp.statusCode, 200);
            assert.equal(resp.body, 'bar');

            server.close();
            assert.end();
        });
    });
});

test('supports params', function t(assert) {
    var router = matchRoutes();
    var server = http.createServer(defaultHandler(router));
    server.listen(0);

    router.set('/:foo', function onFoo(req, res, opts) {
        res.end(opts.params.foo);
    });

    makeRequest(server, {
        url: '/bar'
    }, function onResp(err, resp) {
        assert.ifError(err);

        assert.equal(resp.statusCode, 200);
        assert.equal(resp.body, 'bar');

        server.close();
        assert.end();
    });
});

test('supports splats', function t(assert) {
    var router = matchRoutes();
    var server = http.createServer(defaultHandler(router));
    server.listen(0);

    router.set('/*', function onFoo(req, res, opts) {
        res.end(JSON.stringify(opts.splat));
    });

    makeRequest(server, {
        url: '/huh'
    }, function onResp(err, resp) {
        assert.ifError(err);

        assert.equal(resp.statusCode, 200);
        assert.equal(resp.body, '"huh"');

        server.close();
        assert.end();
    });
});

function defaultHandler(hashRouter) {
    return function handler(req, res) {
        hashRouter.match(req, res, {}, function onError(err) {
            if (err) {
                res.statusCode = err.statusCode || 500;
                res.end(err.message);
            }
        });
    };
}
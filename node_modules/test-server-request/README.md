# test-server-request

A helper to make requests against a server.

## Example

```js
// my-test.js
var test = require('tape');
var makeRequest = require('test-server-request');

var App = require('../app.js');

/* custom app specific logic to spin up your http server.
    probably put this function in a single place.
*/
function allocServer() {
    var myApp = App();

    myApp.httpServer.listen(0);

    // return a http server
    return myApp.httpServer;
}

test('make a request', function t(assert) {
    var server = allocServer();    
    makeRequest(server, {
        url: '/health'
    }, function onResponse(err, resp) {
        assert.ifError(err);

        assert.equal(resp.statusCode, 200);
        assert.equal(resp.body, 'OK');

        server.close();
        assert.end();
    });
});
```

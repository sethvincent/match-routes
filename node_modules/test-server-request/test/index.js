var test = require('tape');

var testServerRequest = require('../index.js');

test('testServerRequest is a function', function (assert) {
    assert.equal(typeof testServerRequest, 'function');
    assert.end();
});

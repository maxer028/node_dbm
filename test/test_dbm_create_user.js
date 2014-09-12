var assert = require('assert');
var dbm = require('../lib/index.js');
var mongodb = require('mongodb');

describe('-- dbm --',function(){
    describe('createUser',function(){
        it('create successful: username not exist or email not exist',function(done){
            dbm.createUser({
                username : 'lili', 
                email    : 'lili@163.com',
                password : '123456',
                usid     : 'abc123'
            }, function (err, result) {     
                assert.strictEqual(err, null);
                assert.ok(result instanceof Array);
                assert.ok(result.length === 1);
                assert.strictEqual(result[0].username, 'lili');
                assert.strictEqual(result[0].email, 'lili@163.com');
                assert.strictEqual(result[0].password, '123456');
                assert.strictEqual(result[0].usid, 'abc123');
                assert.ok(result[0]._id instanceof mongodb.ObjectID);
                done();
            });
        });

        it('create failure: username exist or email exist',function(done){
            dbm.createUser({
                username : 'lili', 
                email    : 'lili@163.com',
                password : '123456',
                usid     : 'abc123'
            }, function (err, result) {
                assert.ok(err instanceof Object);
                assert.ok('name' in err);
                assert.ok('err' in err);
                assert.ok('code' in err);
                assert.ok('n' in err);
                assert.ok(typeof result, 'undefined');
                done();
            });
        });
    });
});
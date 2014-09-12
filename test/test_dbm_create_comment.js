var assert = require('assert');
var dbm = require('../lib/index.js');
var mongodb = require('mongodb');

describe('-- dbm --',function(){
    describe('createComment',function(){
        it('create successful: user exist, articleID match',function(done){
            dbm.createComment({
                username  : 'li', 
                articleID : '53fded391f6769586a5e7fe1',
                parentID  : '53fdf09e79342b396e8c1012',
                text      : 'foobar li'
            }, function (err, result) {     
                assert.strictEqual(err, null);
                assert.ok(result instanceof Array);
                assert.ok(result.length === 1);
                console.log('    %j', result);
                assert.strictEqual(result[0].username, 'li');
                assert.strictEqual(result[0].articleID, '53fded391f6769586a5e7fe1');
                assert.strictEqual(result[0].text, 'foobar li');
                done();
            });
        });
        it('create successful: user exist, articleID match',function(done){
            dbm.createComment({
                username  : 'lili', 
                articleID : '53fded391f6769586a5e7fe1',
                text      : 'foobar lili'
            }, function (err, result) {     
                assert.strictEqual(err, null);
                assert.ok(result instanceof Array);
                assert.ok(result.length === 1);
                console.log('    %j', result);
                assert.strictEqual(result[0].username, 'lili');
                assert.strictEqual(result[0].articleID, '53fded391f6769586a5e7fe1');
                assert.strictEqual(result[0].text, 'foobar lili');
                done();
            });
        });
        it('create failure: articleID not match',function(done){
            dbm.createComment({
                username  : 'lili', 
                articleID : '0000000000',
                text      : 'foobar'
            }, function (err, result) {     
                assert.ok(err instanceof Object);
                done();
            });
        });
    });
});

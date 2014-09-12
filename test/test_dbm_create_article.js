var assert = require('assert');
var dbm = require('../lib/index.js');
var mongodb = require('mongodb');
var NOW = new Date();
var TITLE = 'foo';
var TEXT = 'bar';

describe('-- dbm --',function(){
    describe('createArticle',function(){
        it('create successful: username exist',function(done){
            dbm.createArticle({
                username   : 'lili',
                postTime   : NOW,
                updateTime : NOW,
                title      : TITLE,
                text       : TEXT
            }, function (err, result) {  
                assert.strictEqual(err, null);
                assert.ok(result instanceof Array);
                assert.ok(result.length === 1);
                assert.strictEqual('lili', result[0].username);
                assert.strictEqual(NOW, result[0].postTime);
                assert.strictEqual(NOW, result[0].updateTime);
                assert.strictEqual(TITLE, result[0].title);
                assert.strictEqual(TEXT, result[0].text);
                done();
            });
        });
        it('create failure: username not exist',function(done){
            dbm.createArticle({
                username   : 'lililililili', 
                postTime   : NOW,
                updateTime : NOW,
                title      : TITLE,
                text       : TEXT
            }, function (err, result) {
                assert.strictEqual(null, result);
                done();
            });
        });   
    });
});
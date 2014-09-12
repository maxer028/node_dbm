var mongodb = require('mongodb');
var assert = require('assert');
var http = require('http');
var util = require('../lib/util.js');
var URL = 'mongodb://127.0.0.1:27017/teste';
var OPTIONS = {
    "server" : {
        "poolSize" : 10
    }
};
var COLLECTION = 'users'; 
var USERNAME = 'lili';

describe('-- dbm.util --',function(){
    describe('connect and close',function(){
        it('connect and close mongo server',function(done){
            var connect = util.connect(URL, OPTIONS);
            var _db, __db, ___db;
            // 连接mongo
            console.log('    ... connect mongo server');
            connect(function (db) {   
                _db = db;
                console.log('    ... connect successful');  
                assert.ok(db instanceof Object);
                assert.ok(db instanceof mongodb.Db);
            });
            connect(function (db) {  
                __db = db;  
                console.log('    ... connect successful'); 
                assert.ok(db instanceof Object);
                assert.ok(db instanceof mongodb.Db);
                assert.strictEqual(_db, __db);
                // 关闭连接
                util.close(URL);
                console.log('    ... disconnect'); 
                db.collection(COLLECTION).find({username:USERNAME}).toArray(function (err, result) {
                    assert.strictEqual(result, null);
                });
                connect(function (db) { 
                    console.log('    ... disconnect'); 
                    db.collection(COLLECTION).find({username:USERNAME}).toArray(function (err, result) {
                        assert.strictEqual(result, null);
                    });
                });
                // 重新连接
                connect = util.connect(URL, OPTIONS);
                connect(function (db) { 
                    console.log('    ... connect successful'); 
                    db.collection(COLLECTION).find({username:USERNAME}).toArray(function (err, result) {
                        assert.ok(result instanceof Array);
                        done();
                    });
                });
            });
        });
    });
});
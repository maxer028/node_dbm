// comments:
// {
//    parent_id : OBJECTID | NULL,
//    text      : STRING,
//    push_time : DATE,
//    ... 
// }
//
// 1. [parent_id=null] -- comments => 第1层:
//    {
//       _id_a: { text:xxx, push_time:xxx, childs:[] },
//       _id_b: { text:xxx, push_time:xxx, childs:[] },
//       ...
//    }
//
// 2. _id_a、_id_b、... -- comments => 第2层 
//
//    _id_a: {
//        text:xxx, push_time:xxx,
//        childs: [
//            _id_m: {
//                text:xxx, push_time:xxx
//            },
//            _id_n: {
//                text:xxx, push_time:xxx
//            },
//            ...
//        ]
//    }
//
// 3. _id_m、id_n、... -- comments => 第3层
//
//    _id_m: {
//        text:xxx, push_time:xxx,
//        childs: [
//            _id_o: {
//                text:xxx, push_time:xxx
//            },
//            _id_q: {
//                text:xxx, push_time:xxx
//            },
//            ...
//        ]
//    }

var assert = require('assert');
var dbm = require('../lib/index.js');
var mongodb = require('mongodb');
// EXIST: 需要设置mongo数据库
var EXIST_USERNAME       = 'lili';
var EXIST_EMAIL          = 'lili@163.com';
var EXIST_PASSWORD       = '123456';
var EXIST_USID           = 'abc123';
var NOT_EXIST_USERNAME   = 'liaaaaaaaaaaaaaaa';
var NOT_EXIST_USID       = '10000000000000000000';
// EXIST: 需要设置mongo数据库
var EXIST_ARTICLE_ID     = '53fded391f6769586a5e7fe1';
var NOT_EXIST_ARTICLE_ID = '100000000000000000000001';
var ERROR_ARTICLE_ID     = '100000000000000000000001111111';

describe('-- dbm --',function(){
    describe('findUser',function(){
    	it('find successful: username exist',function(done){
            dbm.findUser(EXIST_USERNAME, function (err, result) {     
                assert.strictEqual(err, null);
                assert.ok(result instanceof Object);
                assert.strictEqual(result.username, EXIST_USERNAME);
                assert.strictEqual(result.email, EXIST_EMAIL);
                assert.strictEqual(result.password, EXIST_PASSWORD);
                assert.strictEqual(result.usid, EXIST_USID);
                done();
            });
        });

        it('find failure:username not exist',function(done){
            dbm.findUser(NOT_EXIST_USERNAME, function (err, result) {     
                assert.strictEqual(err, null);
                assert.strictEqual(result, null);
                done();
            });
        });
    });

    describe('session',function(){
        it('session successful: usid exist',function(done){
            dbm.session(EXIST_USID, function (err, result) {     
                assert.strictEqual(err, null);
                assert.ok(result instanceof Object);
                assert.strictEqual(result.username, 'lili');
                assert.strictEqual(result.email, 'lili@163.com');
                done();
            });
        });

        it('session failure: usid not exist',function(done){
            dbm.session(NOT_EXIST_USID, function (err, result) {     
                assert.strictEqual(err, null);
                assert.strictEqual(result, null);
                done();
            });
        });
    });

    describe('findArticle',function(){
        it('article exist',function(done){
            dbm.findArticle(EXIST_ARTICLE_ID, function (err, result) {  
                assert.ok(result instanceof Object);
                assert.strictEqual(typeof result.text, 'string');
                done();
            });
        });

        it('article not exist',function(done){
            dbm.findArticle(NOT_EXIST_ARTICLE_ID, function (err, result) {  
                assert.strictEqual(null, result);
                done();
            });
        });

        it('article id error',function(done){
            dbm.findArticle(ERROR_ARTICLE_ID, function (err, result) {   
                assert.ok(err instanceof Object);
                assert.strictEqual(err.name, 'IDError');
                done();
            });
        });
    });

    describe('findArticles',function(){
        it('username exist',function(done){
            dbm.findArticles(EXIST_USERNAME, function (err, result) {  
                assert.ok(result instanceof Object);
                assert.ok(result.length > 0);
                done();
            });
        });

        it('username not exist',function(done){
            dbm.findArticles(NOT_EXIST_USERNAME, function (err, result) { 
                assert.ok(result instanceof Object); 
                assert.ok(result.length === 0);
                done();
            });
        });
    });

    describe('findComments',function(){
        it('find comments successful: find article\'s all comments',function(done){
            dbm.findComments('53fded391f6769586a5e7fe1', function (err, result) {    
                var tree = serilize(result, function (cmt) {
                    return {
                        text: cmt.text,
                        username: cmt.username
                    };
                });
                console.log('%j', tree); 
                assert.ok(result instanceof Array);
                assert.ok(result.length > 0);
                done();
            });
        });
    });
});


/*

最顶点undefined


A B C D E F G H I J K L M N ...  **KEY**

1. [ ] => A C I 

B D E F G H J K L M N ...

2. [A] => B E H

D F G J K L M N ...

3. [B] => D F

G J K L M N ...

   [D] =>

*/

function serilize (comments, format) {
    var tree = { childs:[] }; 
    var UNDEFINED;

    function walk (key, value) {
        var i = 0;
        var comment = comments[i]; 
        while (comment) {
            var parentID = comment.parentID ? String(comment.parentID) : comment.parentID;
            if (parentID === key) {
                var child = {};
                var childKey = String(comment._id);
                var childValue = format(comment);
                childValue.childs = [];
                child[childKey] = childValue; 
                value.childs.push(child);
                walk(childKey, childValue);
            }
            comment = comments[++i];
        }
    }

    walk(UNDEFINED, tree);
    return tree;
}

describe('serilize',function(){
    it('render the result to tree',function(){
        var samples = [
            {
                _id: 'id1',
                text: 'foo 1'
            },
            {
                _id: 'id2',
                parentID: 'id1',
                text: 'foo 2'
            },
            {
                _id: 'id3',
                text: 'foo 3'
            },
            {
                _id: 'id4',
                parentID: 'id2',
                text: 'foo 4'
            },
            {
                _id: 'id5',
                parentID: 'id2',
                text: 'foo 5'
            },
            {
                _id: 'id6',
                parentID: 'id4',
                text: 'foo 6'
            }
        ];

        var result = serilize(samples, function (cmt) {
            return {
                text: cmt.text,
            };
        });
             
        assert.strictEqual(result['childs'][0]['id1']['childs'][0]['id2']['text'], 'foo 2');
        assert.strictEqual(result['childs'][0]['id1']['childs'][0]['id2']['childs'][0]['id4']['text'], 'foo 4');
        assert.strictEqual(result['childs'][1]['id3']['text'], 'foo 3');
    });
});


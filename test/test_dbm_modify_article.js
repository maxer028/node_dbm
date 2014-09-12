var assert = require('assert');
var dbm = require('../lib/index.js');
var mongodb = require('mongodb');
var U_TITLE              = 'The Update Title';
var U_TEXT               = 'The update text here.';
// EXIST: 需要设置mongo数据库
var EXIST_ARTICLE_ID     = '53fded391f6769586a5e7fe1';
var NOT_EXIST_ARTICLE_ID = '100000000000000000000001';
var ERROR_ARTICLE_ID     = '100000000000000000000001111111';
// DEL_EXIST值: 需要设置mongo数据库
var DEL_EXIST_ARTICLE_ID = '53f9a07c1a861b9417f210b4';

describe('-- dbm --',function(){
    describe('updateArticle',function(){
        it('article id exist',function(done){
            dbm.updateArticle(EXIST_ARTICLE_ID, {
                title: U_TITLE,
                text: U_TEXT
            }, function (err, nums) {
                assert.strictEqual(err, null);   
                assert.strictEqual(nums, 1);
                done();
            });
        });

        it('article id not exist',function(done){
            dbm.updateArticle(NOT_EXIST_ARTICLE_ID, {
                title: U_TITLE,
                text: U_TEXT
            }, function (err, nums) { 
                assert.strictEqual(err, null);   
                assert.strictEqual(nums, 0);
                done();
            });
        });

        it('article id error',function(done){
            dbm.updateArticle(ERROR_ARTICLE_ID, {
                title: U_TITLE,
                text: U_TEXT
            }, function (err, nums) { 
                assert.ok(err === false); 
                assert.ok(typeof nums === 'undefined');
                done();
            });
        });
    });

	describe('removeArticle',function(){
        it('article id exist',function(done){
            dbm.removeArticle(DEL_EXIST_ARTICLE_ID, function (err, nums) {
                assert.strictEqual(err, null);   
                assert.strictEqual(nums, 1);
                done();
            });
        });

        it('article id not exist',function(done){
            dbm.removeArticle(NOT_EXIST_ARTICLE_ID, function (err, nums) { 
                assert.strictEqual(err, null);   
                assert.strictEqual(nums, 0);
                done();
            });
        });

        it('article id error',function(done){
            dbm.removeArticle(ERROR_ARTICLE_ID, function (err, nums) { 
                assert.ok(err === false); 
                assert.ok(typeof nums === 'undefined');
                done();
            });
        });
    });
});
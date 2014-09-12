// 用户模型User
//     _id      : OBJECTID
//     username : STRING
//     email    : STRING
//     password : STRING
//     usid     : STRING 
//
// 文章模型Article
//     _id      : OBJECTID
//     userID   : OBJECTID
//     username : STRING, 反常规化
//     title    : STRING
//     text     : STRING
//
// 评论模型Comment
//    _id       : OBJECTID
//    userID    : OBJECTID
//    username  : STRING, 反常规化
//    articleID : OBJECTID
//    commentID : OBJECTID
//    text      : STRING   
//
// [articleID] find article -> [articleID] find comments


var mongodb = require('mongodb');
var util = require('./util');
var conf = require('./conf');
var contact = util.connect(conf.contact.url, conf.contact.options);
var COLL_USERS = conf.contact.users;
var COLL_ARTICLES = conf.contact.articles;
var COLL_COMMENTS = conf.contact.comments;

function roll (count, f) {
    return function () { 
        count--;
        if (count === 0) {
            f();
        }
    };
}

function rollData (count, f) {
    var cache = {};
    return function (name, data) { 
        count--;
        if (typeof name === 'string') {
            cache[name] = data;
        }
        if (count === 0) {
            f(cache);
        }
    };
}

function createUser (doc, f) {
// doc
//     username : STRING
//     email    : STRING
//     password : STRING
//     usid     : STRING
// f(err, result)
//     err    : OBJECT | NULL 服务器错误 
//                            当已存在用户时返回错误信息
//     result : ARRAY, 返回插入的用户文档
    var options = { j: true }; 
    contact(function (db) {
        db.collection(COLL_USERS).insert(doc, options, f);
    });
}

function findUser (name, f) {
// name : username | email
// f(err, result)
//     err    : OBJECT | NULL 服务器错误
//     result : OBJECT 返回查询的用户文档
//              NULL   用户不存在
    var selector = {$or : [{username : name}, {email : name}]};
    contact(function (db) {
        db.collection(COLL_USERS).findOne(selector, f);
    });
}

function session (usid, f) {
// usid : STRING 会话ID
// f(err, result)
//     err    : OBJECT | NULL 服务器错误
//     result : OBJECT 返回查询的文档
//              NULL   用户不存在
    var selector = { usid: usid };
    var options = { 
        fields: { 
            _id: 0, 
            username: 1, 
            email: 1 
        } 
    };
    contact(function (db) {
        db.collection(COLL_USERS).findOne(selector, options, f);
    });
}

function createArticle (article, f) { 
// 在"articles"集合中插入一个新的用户文章, 关联username、userID 
// article properties
//     [ userID     : STRING 用户_id(通过"users"集合查找) ]
//     username   : STRING 用户名
//     postTime   : DATE   发布日期
//     updateTime : DATE   更新日期
//     title      : STRING 标题
//     text       : STRING 内容
// 
// f(err, result)
//     err    : OBJECT | NULL 服务器错误
//     result : ARRAY 返回插入的文档  
//              NULL  用户不存在
    var fselector = { username: article.username };
    var foptions = { 
        fields: { _id: 1 } 
    };
    var inoptions = { j: true };
    contact(function (db) {
        db.collection(COLL_USERS).findOne(fselector, foptions, function (err, doc) {
            // 数据库服务器错误
            if (err) { return f(err); }  
            // 用户不存在
            if (doc === null) { return f(null, null); } 
            // 关联用户_id
            article.userID = doc._id;
            db.collection(COLL_ARTICLES).insert(article, inoptions, function (err, result) {
                // 数据库服务器错误 
                if (err) { return f(err); }  
                // 成功插入文章
                f(null, result);
            });
        });
    });
}

function checkId (id) {
    return String(id).length === 24;
}


function updateArticle (id, article, f) {
// id : STRING Article ID
// article
//     title : STRING
//     text  : STRING
// f(err, nums)
//     err  : OBJECT | NULL 服务器错误 
//                          文章id格式错误
//     nums : NUMBER 更新的个数，更新成功为1
    if(!checkId(id)) { return f({ name:"IDError", err:"article id invalid" }); }
    article.updateTime = new Date();
    var selector = { _id: new mongodb.ObjectID(id) };
    var doc = { $set: article };
    var options = { j: true };
    contact(function (db) {
        db.collection(COLL_ARTICLES).update(selector, doc, options, f);
    });
}

function findArticle (id, f) {
// id : STRING, Article ID
// f(err, result)
//     err    : OBJECT | NULL 服务器错误 
//                            文章id格式错误
//     result : OBJECT 找到的文档
//              NULL   文档不存在
    if(!checkId(id)) { return f({ name:"IDError", err:"Article id invalid" }); }
    var selector = { _id: new mongodb.ObjectID(id) };
    contact(function (db) {
        db.collection(COLL_ARTICLES).findOne(selector, f);
    });
}

function findArticles (username, f) {
// f(err, result)
//     err    : OBJECT | NULL 服务器错误
//     result : ARRAY 找到的文章列表
    var selector = { username: username };
    var options = {};
    contact(function (db) {
        db.collection(COLL_ARTICLES).find(selector, options).toArray(f);
    });
}

function removeArticle (id, f) {
// id必须是24长度字符串
// f(err, nums)
//     err  : OBJECT | NULL 服务器错误
//                          文章id格式错误
//     nums : NUMBER 删除的个数，删除成功为1
    if(!checkId(id)) { return f({ name:"IDError", err:"Article id invalid" }); }
    var selector = { _id: new mongodb.ObjectID(id) };
    var options = { j: true };
    contact(function (db) {
        db.collection(COLL_ARTICLES).remove(selector, options, f);
    });
}

function findComments (articleID, f) {
// f(err, result)
//     err    : OBJECT | NULL 服务器错误
//                            articleID格式错误
//     result : ARRAY 找到的评论列表   
    if(!checkId(articleID)) { return f({ name:"IDError", err:"Article id invalid" }); }
    var selector = { articleID: articleID };
    var options = {};
    contact(function (db) {
        db.collection(COLL_COMMENTS).find(selector, options).toArray(f);
    });
}

function findComment (id, f) {
// id : STRING, Comment ID
// f(err, result)
//     err    : OBJECT | NULL 服务器错误
//                            id格式错误
//     result : OBJECT 评论文档
//              NULL   没有该评论文档
    if(!checkId(id)) { return f({ name:"IDError", err:"Comment id invalid" }); }
    var selector = { _id: new mongodb.ObjectID(id) };
    contact(function (db) {
        db.collection(COLL_COMMENTS).findOne(selector, f);
    });
}

function createComment (comment, f) {
// comment
//    [ _id       : OBJECTID, 自动生成 ]
//    [ userID    : OBJECTID, 查找 ]
//    username  : STRING, 反常规化   
//    articleID : OBJECTID         
//    parentID  : OBJECTID         
//    text      : STRING  
//    pushTime  : Date
// f(err, result)
//     err    : OBJECT | NULL 服务器错误
//                            不匹配
//     result : ARRAY 创建成功，返回插入的文档 
//              NULL  用户不存在 
//              FALSE 不匹配
    var options = { j: true };
    var existUser = false;     // userID存在
    var existArticle = false;  // articleID存在
    var existParent = false;   // parentID存在
    var errs = [];  // 错误列表
    var isCheckParent = (comment.hasOwnProperty('parentID'));
    var count = isCheckParent ? 3 : 2;
    var _roll = roll(count, function () { 
        if (errs.length > 0) { return f(errs); } 
        // 不存在用户 | 不存在文章 | 不存在评论
        if (!existUser || !existArticle || 
            (isCheckParent && !existParent)) {
            return f(null, null);
        }
        contact(function (db) {
            db.collection(COLL_COMMENTS).insert(comment, options, function (err, result) {
                // 数据库服务器错误 
                if (err) { 
                    errs.push(err);
                    return f(errs); 
                }  
                // 成功插入评论
                f(null, result);
            });
        });
    }); 
    findUser(comment.username, function (err, result) { 
    // 查找user存在
        if (err instanceof Object) { // 服务器错误
            errs.push(err); 
        } else if (result instanceof Object) { // 存在用户
            existUser = true;
            comment.userID = result._id;
        }
        _roll();
    });
    findArticle(comment.articleID, function (err, result) {
        if (err instanceof Object) { // 服务器错误 | articleID格式错误
            errs.push(err); 
        } else if (result instanceof Object) { // 存在文章
            existArticle = true;
        }  
        _roll();
    });
    if (isCheckParent) {
        findComment(comment.parentID, function (err, result) {
            if (err instanceof Object) { // 服务器错误 | parentID格式错误
                errs.push(err); 
            }else if (result instanceof Object) { // 评论存在
                existParent = true;
            } 
            _roll();
        });
    }
}

exports.createUser = createUser;
exports.findUser = findUser;
exports.session = session;
exports.createArticle = createArticle;
exports.updateArticle = updateArticle;
exports.findArticle = findArticle;
exports.findArticles = findArticles;
exports.removeArticle = removeArticle;
exports.createComment = createComment;
exports.findComments = findComments;

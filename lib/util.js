var mongodb = require('mongodb');
// 数据库连接缓存
var cache = {};

// 连接数据库
function connect (url, options) {
    var fns = [];
    var status = 0;
    var _db = cache[url];
    var args;

    return function (f) {
        args = arguments;
        if (_db !== null && typeof _db === 'object') {
            f(_db);
            return;
        } 
            
        fns.push(f);
        // 当有一个连接初始化请求时，挂起其他初始化请求
        // 连接池建立完后，使用该连接处理挂起的请求
        if (status === 0) {
            status = 1;
            mongodb.MongoClient.connect(url, options, function (err, db) {
                if (err) { throw err; }
                _db = cache[url] = db;
                for (var i = 0, len = fns.length; i < len; i++) {
                    fns.shift().call(null, _db);
                }
            });
        }
    };
}

// 关闭数据库
function close (url) {
    var db = cache[url]; 
    if (db !== null && typeof db === 'object') {
        db.close();
        delete cache[url];
    }
}

exports.connect = connect;
exports.close = close;

var mongodb = require('mongodb');

// 连接数据库
function connect (url, options) {
    var conns = {};        // 数据库连接缓存
    var cache = [];        // 挂起的事务
    var status = 0;      

    return function (f) {
        if (conns[url] instanceof mongodb.Db) {
            return f(conns[url]);
        } 
            
        cache.push(f); 
        // 当有一个连接初始化请求时，挂起其他初始化请求
        // 连接池建立完后，使用该连接处理挂起的请求
        if (status === 0) {
            status = 1;
            mongodb.MongoClient.connect(url, options, function (err, db) {
                if (err) { throw err; }
                conns[url] = db;  
                for (var i = 0, len = cache.length; i < len; i++) {
                    cache.shift().call(null, db);
                }
            });
        }
    };
}

exports.connect = connect;

module.exports = {
    "iomsg" : {
        "url": "mongodb://127.0.0.1:31000,127.0.0.1:31001,127.0.0.1:31002/iomsg",
        "options": {
            "uri_decode_auth": false,   // 转码验证字符
            "db": {
                "w": 2,                 // 写的复制服务器数
                "wtimeout": 500,        // 写的超时时间
                "j": true,              // 写等待日志磁盘同步
                "slaveOk": true         // 读负载均衡
            },
            "replSet": {
                "rs_name": "myset",     // 副本集名字
                "poolSize": 10,         // 每个服务器连接数
                "socketOptions": {
                    //"keepAlive": 2,
                    "connectTimeoutMS": 30000,
                    "socketTimeoutMS": 500
                }
            }
        },
        "collections": {
            "users": "users",
            "loggers": "loggers",
            "articles": "articles",
            "comments": "comments"
        }
    }
};

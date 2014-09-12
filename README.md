# node-dbm

author: tulayang
email: itulayangi@gmail.com iwangtongi@163.com

为nodejs web服务器使用mongoDB数据库进行数据IO编写的数据模型，封装了统一的数据操作接口，封装初始化连接，并在mongoDB服务器错误、重启后重新连接。


# API

 - createUser(doc, callback) 创建用户
 - findUser(name, callback) 通过用户名、EMAIL查找用户
 - session(usid, callback) 验证会话
 - createArticle(doc, callback)	创建文章
 - updateArticle(id, doc, callback) 更新文章
 - findArticle(id, callback) 查找文章
 - findArticles(username, callback)	查找用户所有的文章
 - removeArticle(id, callback) 移除文章
 - createComment(id, callback) 创建评论
 - findComments(comment, callback) 查找所有评论


#conf

conf.js配置mongoDB连接内容
 

# Example

```
var dbm = require('dbm');
dbm.createArticle({
	username   : 'foobar',
	postTime   : new Date(),
	updateTime : new Date(),
	title      : 'foo',
	text       : 'bar'
}, function (err, result) { 
    // code...
});
```

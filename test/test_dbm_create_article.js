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




function Server () {
	Router.call(this);

	var self = this;
	this._server = http.createServer();
	this._server
	.on('request', function (req, res) {
		...
		fif.on('end', function () {
			...
			var pathname = url.parse(req.url).pathname;
			if (!(/\/$/).test(pathname))
				pathname += '/';
			var route = self.find(pathname);
			route.params;
			if (route instanceof Array)
				route.forEach(function (r) {
					r.apply(null, ...);
				});
			else if (typeof route === ' function')
				route.apply(null, ...);
			else {
				res.writeHead(404);
				res.end();
			}
		});
	})
	.on('error', function () {});
}
util.inheret(Server, Router);

function Router () {
	this._events = [];
	this._indexes = {};
}

Router.prototype.on = function (type, listener) {
	if (!this._indexes.hasOwnProperty(type)) {
		this._events.push({
			re: P(type),
			listener: listener
		});
		this._indexes[type] = this._events.length;
	} else {
		var i = this._indexes[type];
		if (this._events[i].listener instanceof Array)
			this._events[i].listener.push(listener);
		else
			this._events[i].listener = [this._events[i].listener, listener];
	}
	return this;
};

Router.prototype.off = function (type) {
	if (this._indexes.hasOwnProperty(type)) {
		var index = this._indexes[type];
		this._events = this._events.filter(function (e, i) {
			return i !== type;
		});
		delete this._indexes[type];
	}	
	return this;
};

Router.prototype.find = function (type) {
	var match = null;
	var i = 0;
	var max = this._events.length - 1;

	while (match === null && i < max) {
		match = this._events[i].re.exec(type);
		i++;
	}

	i--;

	if (match === null)
		return false;
	
	var params = {};
	this._events[i].re.keys.forEach(function (key, i) {
		params[key.name] = match[i+1];
	});
	this._obj.params = params;

	var listener = this._events.listener;
	if (listener instanceof Array)
		listener.forEach(function (item) {
			item.apply(self, args);
		});
	else
		listener.apply(self, args);

	retrun {
		params: params,
		listener: listener
	};
};

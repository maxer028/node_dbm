/*
    创建mongo测试数据命令如下:

    db.users.insert({
        username:'li',
        email:'li@163.com',
        password:'123456abcdefg',
        usid:'li123456789012345678'
    });
    db.articles.insert({
        username:'li',
        title:'The Title',
        text:'The text here.',
        postTime:new Date(),
        updateTime:new Date(),
        userID:ObjectId("53f99dc80fa1519aa2822d8d")
    });
    db.articles.insert({
        username:'li',
        title:'The Title 2',
        text:'The text here.',
        postTime:new Date(),
        updateTime:new Date(),
        userID:ObjectId("53f99dc80fa1519aa2822d8d")
    });
*/


function sql_parse (query) {
	function read () {
		var selector = query.selector;
		var result = '';
		var fields_text = '';
		var order_text = '';

		if (query.fields instanceof Array) {
			fields_text = query.fields.join(', ');
		} else {
			fields_text = '*';
		}

		function selector_parse () {
			if (selector.$or instanceof Array) {
				selector.$or.forEach(function (item) {
					// parse here ...
				});
			}
		}
		
		result += 'select ' + fields_text + 
				  ' from ' + query.table +
				  ' where ' + 
				  ' order by ' +
				  ' limit ;'
	}
}

describe('-- sql-parser --',function(){
    it('should be',function(){
    	var body = {
    		$query: {
    			mod: 'read',
    			// where name='lili' and age>16 and age<26
    			// where name='lili' and (age>16 or age<26)
    			// where (name='lili' and age>16) or (name='li' and age<26)
    			where: [
    				'name=\'lili\'',   // and or
    				'age > 16'         // > = < >= <= !=
    			],
    			sort:[
    				'name asc, age ansc'
    			],
    			skip: 20,
    			limit: 10,
    			fields: [
    				'name', 'age', 'sex', 'type'
    			],
    			table: 'tb'
    		}
    	};
    	// select name, age, sex, type 
    	// from tb 
    	// where name='lili' and age>16
    	// order by name asc, age ansc
    	// limit 20, 10;
    	var result = sql_parse(body.$query);
    });
});

describe('-- sql-parser --',function(){
    it('should be',function(){
    	var body = {
    		$query: {
    			mod: 'read',  // create, read, update, delete
    			// where name='lili' and age>16 and age<26
    			// where (name='lili' and age>16) or (name='li' and age<26)
    			selector: {
    				$or: [
    					{
    						name: 'lili',
    						age: {
    							$gt: 16
    						}
    					},
    					{
    						name: 'li',
    						age: {
    							$lt: 26
    						}
    					}
    				]
				},
    			sort:{
    				name: 1,
    				age: -1//,
    				//{...}
    			},
    			skip: 20,
    			limit: 10,
    			fields: [
    				'name', 'age', 'sex', 'type'
    			],
    			table: 'tb'
    		}
    	};
    	// select name, age, sex, type 
    	// from tb 
    	// where name='lili' and age>16
    	// order by name asc, age ansc
    	// limit 20, 10;
    	var result = sql_parse(body.$query);
    });
});


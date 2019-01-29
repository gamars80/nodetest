var mysql = require('mysql');
 
module.exports = function () {
	console.log('dddd:'+process.env.NODE_ENV);
  var config = require('./config/dev_db_config.json');    // ./는 현재 디렉토리를 나타냅니다
  var pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
  });
 
  return {
    getConnection: function (callback) {    // connection pool을 생성하여 리턴합니다
    	
      pool.getConnection(callback);
    },
    end: function(callback){
      pool.end(callback);
    }
  }
}();
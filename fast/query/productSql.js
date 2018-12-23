var pool = require('../db_connect');
 
module.exports = function () {
  return {
    select: function(callback){
      pool.getConnection(function(err, con){
        var sql = 'select count(*) as cnt from gd_goods';
        con.query(sql, function (err, result, fields) {
          con.release();
          if (err) return callback(err);
          callback(null, result);
        });
      });
    },
    pool: pool
  }
};
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_tangte',
  password        : '1042',
  database        : 'cs290_tangte'
});

module.exports.pool = pool;

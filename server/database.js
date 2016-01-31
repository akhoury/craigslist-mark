
var mysql = require('mysql');

// https://github.com/felixge/node-mysql#connection-options
var mysqlUrl = process.env.NODE_CLM_DB_URL || 'mysql://user:password@localhost/craigslist_mark';

var connection = mysql.createConnection(mysqlUrl);

connection.connect();

var db = {connection: connection};

db.getMark = function (pid, callback) {
    connection.query('SELECT * FROM marks where pid="' + pid + '";', function(err, rows) {
        if(err) {
            return callback(err);
        }
        callback(null, rows[0]);
    });
};

db.setMark = function (pid, data, callback) {
    var query = 'INSERT INTO marks (pid, sold) VALUES ("' + pid + '", 1) ON DUPLICATE KEY UPDATE sold = GREATEST(' + (data.sold ? 'sold + 1' : 'sold - 1') + ', 0)';
    connection.query(query, function(err) {
        if(err) {
            return callback(err);
        }
        db.getMark(pid, callback);
    });
};

// i know, i know.
// http://stackoverflow.com/a/28215691/493756
setInterval(function () {
    connection.query('SELECT 1');
}, 5000);

module.exports = db;

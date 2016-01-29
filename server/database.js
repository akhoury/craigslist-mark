var pg = require('pg');
var client = new pg.Client('postgres://' + process.NODE_DB_USER + ':' + process.NODE_DB_PASS + '@' + process.NODE_DB_HOST + '/' + process.NODE_DB_NAME);
var db = {client: client};

db.getItem = function (id, callback) {
    client.connect(function(err) {
        if(err) {
            return callback(err);
        }
        client.query('SELECT * FROM items where id=' + id + ';', function(err, result) {
            if(err) {
                return callback(err);
            }
            callback(null, result.rows[0]);
            client.end();
        });
    });
};

db.setItem = function (id, data, callback) {
    client.connect(function(err) {
        if(err) {
            return callback(err);
        }
        db.getItem(id, function(err, existing) {
            var query = '';
            var date = new Date();
            if (existing) {
                query = 'UPDATE items SET sold = ' + (data.sold ? 'sold + 1' : 'sold - 1') + ' WHERE id = ' + id + ';';
            } else {
                query = 'INSERT INTO items VALUES (' + id + ', 1);'
            }
            client.query(query, function(err, result) {
                if(err) {
                    return callback(err);
                }
                callback(null, result.rows[0]);
                client.end();
            });
        });
    });
};

module.exports = db;

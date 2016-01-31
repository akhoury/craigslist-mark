var fs = require('fs');
var path = require('path');
var db = require('./database');

db.connection.query(fs.readFileSync(path.join(__dirname, './schema.sql'), {encoding: 'utf-8'}).replace(/;$/, ''), function(err) {
    if(err) {
        return console.error(err);
    }
    console.log("schema created.");
});
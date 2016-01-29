var db = require('./database');

db.client.connect(function(err) {
    if(err) {
        return console.error(err);
    }
    db.client.query('CREATE TABLE items ('
        + 'id        varchar(255) CONSTRAINT firstkey PRIMARY KEY,'
        + 'sold      integer NOT NULL,'
        + 'created   timestamp default current_timestamp,'
        + 'updated   timestamp default current_timestamp'
        +  ');',
        function(err, result) {
            if(err) {
                return console.error(err);
            }
            db.client.end();
    });
});
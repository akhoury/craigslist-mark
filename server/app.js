var express = require('express');
var app = express();
var db = require('./database');

app.use(express.static('../dist/public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/:id', function (req, res) {
    db.getItem(req.params.id, function(err, data) {
        if (err) {
            return res.send({});
        }
        res.send(data);
    });
});

app.post('/:id', function (req, res) {
    db.getItem(req.params.id, function(err, data) {
        if (err) {
            return res.send({});
        }
        res.send(data);
    });
});

var port = process.env.NODE_PORT || 3000;
app.listen(3000, function () {
    console.log('listening on port', port);
});
var express = require('express');
var app = express();
var db = require('./database');

app.use(express.static('public'));

app.get('/:id', function (req, res) {

});

app.post('/:id', function (req, res) {

});

var port = process.NODE_PORT || 3000;
app.listen(3000, function () {
    console.log('listening on port', port);
});
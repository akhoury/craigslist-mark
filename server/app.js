var db = require('./database');

var express = require('express');
var app = express();

var Recaptcha = require('recaptcha-verify');

var recaptcha = new Recaptcha({
    secret: process.env.NODE_CLM_CAPTCHA_SECRET_KEY
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('../dist/public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/:pid', function (req, res) {
    db.getMark(req.params.pid, function(err, data) {
        if (err) {
            return res.send({});
        }
        res.send(data);
    });
});

app.post('/:pid', function (req, res) {
    recaptcha.checkResponse(req.body.captchaResponse || "", function(error, response){
        if (error){
            return res.status(400).send(error);
        }
        if (response.success) {
            db.setMark(req.params.pid, {sold: resolve(req.body.sold) }, function(err, data) {
                if (err) {
                    return res.send({});
                }
                res.send(data);
            });
        } else {
            return res.status(401).send({message: "FUCK_OFF_BOT"});
        }
    });
});

var port = process.env.NODE_CLM_PORT || 3000;

if (port != 80 && port != 443) {
    app.set('trust proxy', true);
}

app.listen(port, function () {
    console.log('listening on port', port);
});

function resolve (token) {
    if( typeof token != "string")
        return token;
    if( token.length < 15 && token.match(/^-?\d+(\.\d+)?$/) ){
        token = parseFloat(token);
    }
    else if( token.match(/^true|false$/i) ){
        token = Boolean(token.match(/true/i));
    }
    else if(token === "undefined" ){
        token = undefined;
    }
    else if(token === "null" ){
        token = null;
    }
    return token;
}


/*
var fs = require('fs');
var https = require('https');
var http = require('http');
var getUpcoming = require('./Startgg/getUpcoming')
var privateKey  = fs.readFileSync('selfsigned.key', 'utf8');
var certificate = fs.readFileSync('selfsigned.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
*/

var express = require('express');
var app = express();
var cors = require('cors')
app.use(cors())

app.use(express.json());

app.get('/', (req, res) => {
    res.send('MA Smash Website Start.gg Server')
})

app.get('/getUpcoming', (req, res) => {
    getUpcoming().then((result) => res.send(result))
})

app.listen(4000)
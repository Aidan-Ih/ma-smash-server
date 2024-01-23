var fs = require('fs');
var https = require('https');
var http = require('http');
var cors = require('cors')
var getUpcoming = require('./Startgg/getUpcoming')
var privateKey  = fs.readFileSync('selfsigned.key', 'utf8');
var certificate = fs.readFileSync('selfsigned.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var express = require('express');
var app = express();
app.use(cors())

app.use(express.json());

app.get('/', (req, res) => {
    res.send('MA Smash Website Start.gg Server')
})

app.get('/getUpcoming', (req, res) => {
    getUpcoming().then((result) => res.send(result))
})

// your express configuration here

var httpsServer = http.createServer(credentials, app);
httpsServer.listen(8080)

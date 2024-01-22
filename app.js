var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('selfsigned.key', 'utf8');
var certificate = fs.readFileSync('selfsigned.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

app.use(cors());
app.use(express.json());
StartggWorker(app);
app.get('/', (req, res) => {
    res.send('NE Smash Website Start.gg Server')
})

// your express configuration here

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(4000);

console.log("start.gg worker listening on port 4000")
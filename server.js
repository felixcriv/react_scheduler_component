var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/dist'));

app.get('/', function(request, response) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(app.get('port'));

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(8000);

app.use(express.static(__dirname + '/'));
app.get('/',function(req,res){
    res.sendfile(__dirname + 'index.html');
});


io.sockets.on('connection', function(socket){
    //console.log("tu puta madre");
    socket.on('sendMessage', function(data) {
        io.socket.emit('sendMessage', {msg: data});
    });
});


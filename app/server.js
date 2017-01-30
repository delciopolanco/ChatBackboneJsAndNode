var express = require('express'),
    app = express(),
    path = require('path'),
    http = require('http').Server(app),
    io = require('socket.io')(http);



app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'deploy/index.html'));
});
app.use(express.static(path.join(__dirname, '..', 'deploy/public')));

io.on('connection', function (socket) {
    console.log('user connected');
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
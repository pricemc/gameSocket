var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var UUID = require('node-uuid');


var connectCounter = 0;
var gameport = process.env.PORT || 4004;
var rooms = [];

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/" + 'index.html');
});

io.use(function(socket, next) {
  var handshakeData = socket.request;
  // make sure the handshake data looks good as before
  // if error do this:
    // next(new Error('not authorized');
  // else just call next
  next();
});

io.on('connection', function (socket) {
    connected(socket);
});

http.listen(gameport, function () {
    console.log('listening on *: ' + gameport);
});



var connected = function(socket){
    connectCounter++;
    socket.userid = UUID();

    socket.emit('onconnected', {
        id: socket.userid
    });

    socket.join('default');
//    io.to('default').emit('some event', {
//        msg: 'hello'
//    });

    console.log('\t socket.io:: player ' + socket.userid + ' connected');

    socket.on('disconnect', function () {

        console.log('\t socket.io:: client disconnected ' + socket.userid);
        connectCounter--;
    });
};
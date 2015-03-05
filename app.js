var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cameraIndex = 0;
var hash = {};
var adminSocket;
var triggerSocket;

server.listen(80);

app.use(express.static('client'));

app.get('/admin', function (req, res) {

    res.sendfile(__dirname + '/client/admin.html');

});

app.get('/trigger', function (req, res) {

    res.sendfile(__dirname + '/client/trigger.html');

});

io.on('connection', function (socket) {

    socket.emit('setId', {id: cameraIndex});

    hash[socket.id] = {
        index: cameraIndex,
        ready: false
    };

    cameraIndex++;

    socket.on('snap', function() {

        socket.broadcast.emit('snap');

    });

    socket.on('disconnect', function() {

        cameraIndex--;

        if (adminSocket){
            adminSocket.emit('camerasUpdate', {total: cameraIndex, cameras: hash});
        }

        if (hash[socket.id]) {
            delete hash[socket.id];

            if (adminSocket) {
                adminSocket.emit('camerasUpdate', {total: cameraIndex, cameras: hash});
            }

        }

    });

    socket.on('cameraReady', function() {

        hash[socket.id].ready = true;
        if (adminSocket) {
            adminSocket.emit('camerasUpdate', {total: cameraIndex, cameras: hash});
        }

    });

    socket.on('isThereAnAdmin', function() {

        socket.emit('isThereAnAdmin', !!adminSocket);

    });

    socket.on('iAmTrigger', function() {

        triggerSocket = socket;

        cameraIndex--;
        delete hash[socket.id];

        if (adminSocket) {
            adminSocket.emit('camerasUpdate', {total: cameraIndex, cameras: hash});
        }

        socket.on('disconnect', function() {

            cameraIndex++;
            if (adminSocket) {
                adminSocket.emit('camerasUpdate', {total: cameraIndex, cameras: hash});
            }

        });

    });

    socket.on('iAmAdmin', function() {

        cameraIndex--;
        delete hash[socket.id];
        adminSocket = socket;
        adminSocket.emit('camerasUpdate', {total: cameraIndex, cameras: hash});

        socket.on('disconnect', function() {

            cameraIndex++;
            adminSocket = null;

        });

    });


    socket.on('newImage', function(img) {

        if (adminSocket) {
            adminSocket.emit('newImage', {index: hash[socket.id].index, img: img});
        }

    });

    if (adminSocket) {
        adminSocket.emit('camerasUpdate', {total: cameraIndex, cameras: hash});
    }

});
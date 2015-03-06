var nf = nf || {};

nf.app = (function(){

    var socket = io.connect('http://your-server-here/'),
        camId = document.getElementById('id');

    socket.on('snap', function() {
        nf.camera.click();
    });

    socket.on('setId', function(data) {
        camId.textContent = data.id;
    });

    return {
        socket: socket
    }

}());
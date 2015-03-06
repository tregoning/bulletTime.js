(function() {

    var socket = io.connect('http://your-server-here/'),
        isDisabled = false,
        clicker;

    var snap = function() {

        socket.emit('snap');

    };

    var init = function() {

        clicker = document.body;

        clicker.addEventListener('click', function() {

            if (!isDisabled){
                isDisabled = true;
                socket.emit('snap');
            }
            window.setTimeout(function(){
                isDisabled = false;
            }, 1000);

        }, false);

        socket.emit('iAmTrigger');

    };

    socket.on('connect', function(){
        init();
    });

}());
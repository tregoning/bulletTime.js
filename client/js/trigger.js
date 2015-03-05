//(function(){

var socket = io.connect('http://lgml-jtregoning.corp.netflix.com/'),
    clicker;

var snap = function() {

    socket.emit('snap');

};

var init = function() {

    clicker = document.body;

    clicker.addEventListener('click', function() {
        snap();
    }, false);

    clicker.addEventListener('touchstart', function() {
        snap();
    }, false);

    socket.emit('iAmTrigger');

};

socket.on('connect', function(){
    init();
});
//}());
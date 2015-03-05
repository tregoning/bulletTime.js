//(function(){

var socket = io.connect('http://lgml-jtregoning.corp.netflix.com/'),
    totalCamerasNode = document.getElementById('camerasTotal'),
    rigContainer,
    rigArray,
    clicker,
    video,
    source,
    rigTemplate,
    totalCameras,
    shotCollection,
    shotsRemaining,
    width = 720,
    height = 540;

socket.on('iamAdmin', function(data) {

});

var snap = function() {

    socket.emit('snap');

};

var iAmAdmin = function() {
    socket.emit('iAmAdmin');
};

var isThereAnAdmin = function() {
    socket.emit('isThereAnAdmin');
};

var addEventHandlers = function() {

    clicker.addEventListener('click', function() {
        snap();
    }, false);

};

var renderGif = function() {

    shotCollection.forEach(function(img){
        nf.gif.addFrame(img);
    });

    nf.gif.render();

};

var init = function() {

    source = document.getElementById('rig-template').innerHTML;
    rigContainer = document.getElementById('rig');
    clicker = document.getElementById('clicker');
    video = document.querySelector('video');
    rigTemplate = Handlebars.compile(source);
    addEventHandlers();
    iAmAdmin();
    nf.gif.setup(width, height);

};

socket.on('isThereAnAdmin', function(data) {

    console.log('->', data);

});

socket.on('camerasUpdate', function(data) {

    totalCameras = data.total;

    totalCamerasNode.innerText = 'Cameras:' + totalCameras;

    rigArray = Object.keys(data.cameras).map(function (key) {
        return data.cameras[key]
    });

    rigContainer.innerHTML = rigTemplate({cameras: rigArray});

    shotsRemaining = [];

    for (var i = 0; i < totalCameras; i++) {
        shotsRemaining.push(i);
    }

    shotCollection = new Array(totalCameras);


});

socket.on('newImage', function(data) {

    console.log('new image', data.index);

    var img = document.createElement('img'),
        remaining;

        img.src = data.img;


    shotCollection[data.index] = img;
    shotsRemaining[data.index] = false;

    remaining = shotsRemaining.some(function(item){
        return item;
    });

    if (!remaining){
        renderGif();
    }

});

socket.on('connect', function(){
    init();
});
//}());
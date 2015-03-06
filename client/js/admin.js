(function() {

    var socket = io.connect('http://your-server-here/'),
        totalCamerasNode = document.getElementById('camerasTotal'),
        rigContainer,
        rigArray,
        video,
        source,
        rigTemplate,
        totalCameras,
        shotCollection,
        shotsRemaining,
        width = 1080,
        height = 810;

    var snap = function() {
        socket.emit('snap');
    };

    var iAmAdmin = function() {
        socket.emit('iAmAdmin');
    };

    var isThereAnAdmin = function() {
        socket.emit('isThereAnAdmin');
    };

    var renderGif = function() {

        shotCollection.forEach(function(img){
            nf.gif.addFrame(img);
        });

        // comment out this section if you don't want the gif to be a palindrome
        shotCollection.splice(0,1);
        shotCollection.splice(shotCollection.length - 1, 1);
        shotCollection.reverse().forEach(function(img){
            nf.gif.addFrame(img);
        });

        nf.gif.render();

    };

    var init = function() {

        source = document.getElementById('rig-template').innerHTML;
        rigContainer = document.getElementById('rig');
        video = document.querySelector('video');
        rigTemplate = Handlebars.compile(source);
        iAmAdmin();
        nf.gif.setup(width, height);

    };

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

}());
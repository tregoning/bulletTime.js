var nf = nf || {};

nf.camera = (function() {

    var width = 1080,
        height = 0,  // Calculated based on the aspect ratio of the input stream
        streaming = false,
        video = null,
        canvas = null,
        photo = null,
        startbutton = null;

    // Fill the photo with an indication that none has been taken
    function clearphoto() {

        var context = canvas.getContext('2d'),
            data;

        context.fillStyle = "#000";
        context.fillRect(0, 0, canvas.width, canvas.height);
        data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);

    }

    function init() {


        video = document.querySelector('video');
        canvas = document.createElement('canvas');//document.querySelector('canvas');
        photo = document.getElementById('photo');
        startbutton = document.getElementById('photoTrigger');

        navigator.getMedia = ( navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

        navigator.getMedia({

                video: true,
                audio: false

            }, function(stream) {

                if (navigator.mozGetUserMedia) {
                    video.mozSrcObject = stream;
                } else {
                    var vendorURL = window.URL || window.webkitURL;
                    video.src = vendorURL.createObjectURL(stream);
                }
                video.play();

            }, function(err) {
                console.error(err);
            }
        );

        clearphoto();

        video.addEventListener('canplay', function(ev) {

            if (!streaming) {

                height = video.videoHeight / (video.videoWidth / width);

                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;

                if (nf.app.socket) {
                    nf.app.socket.emit('cameraReady');
                }

            }

        }, false);

    }

    function takepicture() {

        var context = canvas.getContext('2d'),
            data;

        if (width && height) {

            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            //providing visual feedback of the 'click' (to test sync issues)
            document.body.classList.add('clicked');
            window.setTimeout(function(){
                document.body.classList.remove('clicked');
            }, 200);

            data = canvas.toDataURL('image/png');

            if (nf.app.socket) {
                console.log('newImage');
                nf.app.socket.emit('newImage', data);
            }

            photo.setAttribute('src', data);

        } else {

            clearphoto();

        }

    }

    init();

    return {

        click: takepicture,
        status: function() {

            return streaming ? 'ready' : 'error'

        }

    }

}());
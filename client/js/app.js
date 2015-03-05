//(function(){

    var socket = io.connect('http://lgml-jtregoning.corp.netflix.com/'),
        camId = document.getElementById('id');

    socket.on('snap', function() {
        nf.camera.click();
        document.body.classList.add('clicked');
        window.setTimeout(function(){
            document.body.classList.remove('clicked');
        }, 200);
    });

    socket.on('setId', function(data) {
        camId.textContent = data.id;
    });

//}());
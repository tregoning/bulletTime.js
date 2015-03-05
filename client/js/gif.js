var nf = nf || {};

nf.gif = (function() {

    var gif,
        img,
        sampleInterval = 333,
        outputBox;

    var setupGifEngine = function(width, height) {

        outputBox = document.getElementById('gifBox');

        gif = new GIF({
            workers: 4,
            workerScript: '/libs/gif.js/dist/gif.worker.js',
            width: width,
            height: height
        });

        gif.on('finished', function(blob) {

            var wrapper,
                img;

            img = document.createElement('img');
            img.src = URL.createObjectURL(blob);
            wrapper = document.createElement('a');
            wrapper.classList.add('imgWrapper');
            wrapper.href = img.src;

            //wrapper.addEventListener('click', function() {
            //    //sending file to server
            //    var fileName ='nfx-' + new Date().getTime() + '.gif';
            //
            //    var theForm = new FormData(),
            //        request = new XMLHttpRequest();
            //    theForm.append('file', blob, fileName);
            //    request.open(
            //        "POST",
            //        "http://meme-api.netflix.com/api/v1/upload",
            //        true
            //    );
            //    //request.send(theForm);
            //
            //});

            //wrapper.setAttribute('download', 'meme-' + new Date().getTime());

            wrapper.appendChild(img);
            outputBox.appendChild(wrapper);

            reset();

        });

    };

    var addFrame = function(img) {

        gif.addFrame(img, {
            delay: sampleInterval
        });

    };

    var render = function() {

        gif.render();

    };

    var reset = function() {
        gif.running = false;
        gif.frames = [];
        delete gif.nextFrame;
        delete gif.imageParts;
        delete gif.finishedFrames;
    };

    return {
        setup: setupGifEngine,
        render: render,
        addFrame: addFrame
    }

}());

var nf = nf || {};

nf.gif = (function() {

    var gif,
        img,
        sampleInterval = 150,
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

            wrapper.setAttribute('download', 'bulletTime-' + new Date().getTime());

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

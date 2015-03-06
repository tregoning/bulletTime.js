# bulletTime.js
Recreate the "Bullet Time" FX using only web technologies

##Sample:
![demo image](https://raw.githubusercontent.com/tregoning/bulletTime.js/master/client/img/demo.gif)

#Description:
Attempt to recreate the famous 'Bullet Time' FX using only web tech, (HTML5, webRTC, webSockets, Node). You can add more cameras simply by opening a web page and granting access to your webcam, and you can trigger the shot by using your phone (again simply load a page on your phone). and the server will collate the shots and automatically create a GIF.

#TODO:
This is the results of a Hackday, as you might expect the code is not *great* here are some of the obvious things that are missing

* Config file (at the moment the user needs to add the server name in muliple files)
* Ability to re-arange dynamically the order of the cameras
* Ability to configure the resolution of the GIF
* Options to trigger by sound, or relaying on NTP
* Ability to cleanly add more shots without having to reload the admin page after each shot

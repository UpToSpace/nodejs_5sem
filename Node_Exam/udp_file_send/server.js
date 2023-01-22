var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var fs = require("fs");


var wstream = fs.createWriteStream('file.txt');

wstream.on('Transfer success', function () {
    console.log('File writed');
});

server.on('message', function (message, remote) {
    wstream.write(message);
    wstream.end();
});

server.bind(8080, 'localhost');
var port = 8080;
var host = 'localhost';
var dgram = require('dgram');
var client = dgram.createSocket('udp4');
var fs = require("fs");

fs.readFile('D:\\Desktop\\Novy_textovy_dokument.txt', function (err, data) {
    if (err) {
        return console.log(err);
    }
    client.send(data, 0, data.length, port, host, function (err, bytes) {
        if (err)
            throw err;
        console.log('File recipiented ' + host + ':' + port);
    });
});
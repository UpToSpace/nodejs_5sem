const net = require('net');

let HOST = '127.0.0.1';
let PORT = 4000;

let client = new net.Socket();
let buffer = new Buffer.alloc(5);

client.connect(PORT, HOST, () => {
    console.log(`Client connected: ${client.remoteAddress}:${client.remotePort}`);

    let k = 1;

    let writer = setInterval(() => {
        console.log(`Client sent: ${k}`);
        client.write((buffer.writeInt32LE(k++, 0), buffer));
    }, 1 * 1000);

    setTimeout(() => {
        clearInterval(writer);
        client.end();
    }, 20 * 1000);
});


client.on('data', data => {
    console.log(`Client received data from server: ${data.readInt32LE()}`);
});

client.on('close', () => {
    console.log('Client closed');
});

client.on('error', (e) => {
    console.log('Client error: ', e);
});
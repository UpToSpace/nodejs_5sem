const net = require('net');

let HOST = '127.0.0.1';
let PORT = 40000; // ports 50000 and 40000

let client = new net.Socket();

let prfx = isNaN(process.argv[2]) ? 2 : process.argv[2];
let buffer = new Buffer.alloc(4);

client.connect(PORT, HOST, () => {
    console.log(`Client connected: ${client.remoteAddress}:${client.remotePort}`);

    setInterval(() => {
        client.write((buffer.writeInt32LE(prfx, 0), buffer));
    }, 1 * 1000);
});

client.on('data', data => {
    console.log(`
    ${data}`);
});

client.on('close', () => {
    console.log('Client closed');
});

client.on('error', (e) => {
    console.log('Client error: ', e);
});
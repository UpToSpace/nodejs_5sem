const net = require('net');
let HOST = '127.0.0.1';
let PORT = 40000;

let client = new net.Socket();

client.connect(PORT, HOST, () => {
    console.log('Client connected:  ', client.remoteAddress + ' : ' + client.remotePort);
    client.write('Hello from client!');
})
client.on('data', (data) => {
    console.log('Server answer:     ', data.toString());
    client.destroy();
});
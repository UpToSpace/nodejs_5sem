let net = require('net');

let client = new net.Socket();
client.connect(3000,'localhost',()=>{console.log('Succussful connection!')});

let number = 0;
let message=process.argv[2];

setInterval(() => {
    client.write(`\nmessage:${message}, num: ${++number}\n`);
}, 10000);
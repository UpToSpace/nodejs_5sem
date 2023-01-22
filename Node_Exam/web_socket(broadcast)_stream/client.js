let ws = require('ws');

const client = new ws('ws://localhost:3000/broadcast');

let name = process.argv[2];

if (name == 'undefined') {
    name = 'anonimus'
};

client.on('open', () => {
    client.send(`name: ${name}`);
    client.on('message', (message) => {
        console.log(`message from server: ${message}`)
    })
    setTimeout(() => {
        client.close();
    }, 20000)
})
const ws = require('ws');  

let client = new ws('ws://localhost:3000/');
setTimeout(() => {
    client.close();
}, 20 * 1000)

client.on('open', () => {
    process.stdin.on('data', data => {
        let duplex = ws.createWebSocketStream(client, { encoding: 'utf8' });
        duplex.write(data.toString());
    }).unref()
})

client.on('message', data => {
    console.log(data.toString());
})
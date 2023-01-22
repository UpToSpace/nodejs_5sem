const ws = require('ws');

let wsServer = new ws.Server({port: 3000, host: 'localhost', path: '/'});
wsServer.on('connection', (socket) => {
    socket.on('message', m => {
        console.log(m.toString());
        wsServer.clients.forEach(client => {
            client.send(m);
        })
    })
})
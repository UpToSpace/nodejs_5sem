const net = require('net')

let server = net.createServer((socket) => {
    socket.on('data', (data) => {
        socket.write('server :' + data)
    })
    socket.on('error', (err) => {
        console.log(err)
    })
    socket.on('close', () => {
        console.log('Connection closed')
    })
}).listen(3000, '0.0.0.0')
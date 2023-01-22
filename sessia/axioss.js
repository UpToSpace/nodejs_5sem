// const fs = require('fs');
// const http = require('http');

// http.createServer((req, res) => {
//     let data = ''
//     if (req.method == 'POST' && req.url == '/') {
//     req.on('data', (chunk) => {
//         data += chunk.toString('utf-8')
//     });
//     req.on('end', () => {
//         fs.writeFileSync('./downloaded', data);
//         res.writeHead(200, { 'Content-Type': 'text/plain' });
//         res.end('written');
//     });
// }}).listen(5000, () => {
//     console.log('http.createServer: listen: 5000');
// });

// UDP. Сделайте сервер, который будет принимать сообщения от клиента, выводить их в консоль
//  (с выводом с какого сокета отправлено) и отправлять обратно с префиксом "echo:". 
//  Сделайте клиента, который отправляет как сообщение текст, введённый через стандартный поток ввода.

const udp = require('dgram');

let server = udp.createSocket('udp4')

server.on('message', (msg, rinfo) => {
    console.log(msg + 'from ' + rinfo.address)
    server.send('echo: ' + msg, rinfo.port, rinfo.address)
})

server.bind(4000)
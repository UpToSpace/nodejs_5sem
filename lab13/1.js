const net = require('net');
let HOST = '0.0.0.0';
let PORT = 40000;

net.createServer((sock)=>
{
    console.log('Server Connected:      '+ sock.remoteAddress+':'+sock.remotePort);
    sock.on('data',(data)=>
    {
        sock.write('ECHO: ' + data);
    });
    sock.on('close',(data)=>
    {
        console.log("Server closed");
    })
    sock.on('error', e => console.log(e))
}).listen(PORT, HOST);

console.log('TCP-сервер '+ HOST + ':' + PORT);
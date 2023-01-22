const net = require ('net');
let server = net.createServer(function(connection){
    console.log('new Connection!');

    connection.on('data',(data)=>{
console.log(`host: ${connection.localAddress}, port ${connection.localPort}`);
console.log(`echo: ${data}`)
    })
}
).listen(5000,'localhost',()=>{console.log('server start!')});
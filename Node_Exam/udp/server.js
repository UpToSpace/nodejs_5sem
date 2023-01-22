let udp=require('dgram');

let server=udp.createSocket('udp4');
server.bind(3030,()=>{
    console.log('server start!');
});

server.on('message',(message,info)=>{
    console.log(`client info: ${info.address}, ${info.port}. \n`);
    console.log(`Message from client: ${message} .\n`);

    let serverMess=`echo: ${message}`;
    server.send(serverMess,info.port,info.address,(err)=>{
        if (err) {
            server.close();
            console.log('Server close with error.');
    
        }
    });

})
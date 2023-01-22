let ws=require('ws');

let server=new ws.Server({port:3000,host:'localhost',path:'/broadcast'});

server.on('connection',(conn)=>{
    conn.on('message',(message)=>{
        server.clients.forEach((client)=>{
            if (client.readyState===ws.OPEN){//открыто соединение с клиентом 
                client.send(`allmessages ${message}`);
            }
        })
    })
    conn.on('close',()=>{
        console.log('socket closed');
        process.exit();
    });
})
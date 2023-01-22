let net=require('net');
let fs=require('fs');


let server = net.createServer(function(connection){
    console.log('new Connection!');
    let fullMsg='';
    
connection.on('data',(data)=>{  
    fullMsg+=data.toString();
    let toFile= `localhost:${connection.localAddress},port:${connection.localPort}\nmessage: ${fullMsg}\n`;
    fs.writeFileSync('myFile.txt',toFile);//запись в файл
})

}).listen(3000,'localhost',()=>{console.log('server start')});
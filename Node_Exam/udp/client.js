let udp=require('dgram');
let readline=require('readline');

let read=readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  read.on('line',(line)=>{
    client.send(line,3030,'localhost',(err)=>{
        if (err){
            client.close();
            console.log('Error!!!');
        }
        else
        {
            console.log('Client send msg.');
        }
    });
  });
let client=udp.createSocket('udp4');


client.on('message',(message,info)=>{
    console.log(message.toString());
})
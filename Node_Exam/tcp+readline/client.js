const net = require ('net');
const readline= require('readline');

let client= new net.Socket();//подкл к сокету,т.е. к серверу тсп ,который работает на сокете.создаем объект сокета
client.connect(5000,'localhost',()=>{console.log('connected to server success! write message')});//подключаемся

let read=  readline.createInterface( {input: process.stdin, output: process.stdout});//ввод с консоли


read.on('line',(line)=>{//получаем с консоли данные
    client.write(line.toString());//отправка серверу
});


setTimeout(()=>{
    client.destroy();
console.log('session close!');
},100000);
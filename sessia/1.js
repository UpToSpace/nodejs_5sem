const http = require('http');

// const mypromise = new Promise((resolve, reject) => {
//     setTimeout(() => { // если бы не было дальше синхронного кода, то сработал бы resolve и перешел бы на then
//         resolve('Hello World');
//     }, 1000);
//     if (1 < 2) { // условие истинно, поэтому при вызове перейдет на catch
//         reject('Error');
//     }
// });

// mypromise // вызов промиса, результат error
//     .then((data) => {
//         console.log(data);
//     })
//     .catch((err) => console.log(err));

// let func = async () => {
//     try {
//         let m = await mypromise;
//         console.log(m);
//     }
//     catch (err) {
//         console.log(err);
//     }
// }

// func();

// let server = http.createServer((req, res) => {
// if (req.method == 'GET' && req.url == '/1') {
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('Hello World');
// }
// }).listen(3000);

// server.on('listening', () => console.log('Server is listening...'));
// setInterval(() => {
//     process.stdout.write('Interval\n');
// }, 1000)

// setTimeout(() => {
//     server.close(() => console.log('Server closed...'));
// }, 2500);


// const EventEmitter = require('events');

// const eventEmitter = new EventEmitter();

// eventEmitter.on('start', (mes) => { // 1 аргумент - название события, 2 - функция, которая будет вызвана при срабатывании события
//     console.log(mes);
//   });
// eventEmitter.emit('start', 'message from eventEmitter'); // вызов события

//delete require.cache[require.resolve('./1.js')]; // очистка кэша модуля
// const axios = require('axios');

// axios({url: 'http://localhost:3000/1', method: 'GET'})
// .then(res => console.log(res.data + res.headers))
// .catch(err => console.log(err));







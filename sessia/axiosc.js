// const axios = require('axios');
// const http = require('http');
// const fs = require('fs');

// axios({
//     url: 'http://localhost:5000/',
//     method: 'POST',
//     data: fs.readFileSync('./hey.txt')
// }).then(
//     res => {
//         console.log(res.data)
//     }).catch(err => {
//         console.log(err)
//     });

const udp = require('dgram')

let client = udp.createSocket('udp4')

process.stdin.on('data', data => {
    client.send(data, 4000, 'localhost')
})

client.on('message', (msg, rinfo) => {
    console.log(msg.toString())
})
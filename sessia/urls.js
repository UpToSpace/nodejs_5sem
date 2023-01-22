const http = require('http');
const fs = require('fs');

let server = http.createServer((req, res) => {
    let result = '';
    req.on('data', data => {
        result += data;
    })
    req.on('end', () => {
        fs.writeFile('./my.json', result, (err) => {     
            if (err) {
                console.log(err);
            }
            res.end('OK');
        })
    })
})
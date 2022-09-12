const http = require('http')
const fs = require('fs')

http.createServer(function (request, response) {
    let filepath = ''
    switch (request.url) {
        case '/html':
            filepath = './index.html'
            response.writeHead(200, { 'Content-Type': 'text/html' });
            fs.access(filepath, fs.constants.F_OK, err => {
                if (err) {
                    response.end("<h2> An error... </h2>")
                }
                fs.createReadStream(filepath).pipe(response)
            })
            break;
        case '/png':
            filepath = './pic.png'
            fs.access(filepath, fs.constants.F_OK, err => {
                if (err) {
                    response.statusCode = 404
                    response.end()
                }
                fs.createReadStream(filepath).pipe(response)
            })
            break;
        case '/api/name':
            filepath = './mytext.txt'
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            fs.readFile(filepath, (err, data) => {
                if (err) response.statusCode = 404
                response.end(data.toString())
            })
            break;
        case '/xmlhttprequest':
            filepath = './xmlhttprequest.html'
            fs.readFile(filepath, (err, data) => {
                if (err) response.statusCode = 404
                response.end(data)
            })
            break;
        case '/fetch':
            filepath = './fetch.html'
            fs.readFile(filepath, (err, data) => {
                if (err) response.statusCode = 404
                response.end(data)
            })
            break;
        case '/jquery':
            filepath = './jquery.html'
            fs.readFile(filepath, (err, data) => {
                if (err) response.statusCode = 404
                response.end(data)
            })
            break;
    }
}).listen(5000)

console.log('Server running at http://localhost:5000')
const http = require('http')
const fs = require('fs')

http.createServer(function (request, response) {
    if (request.url == '/api/name') {
        let filepath = './mytext.txt'
        response.writeHead(200, {'Content-Type':'text/plain'});
        fs.readFile(filepath, (err, data) => {
            if (err) response.statusCode = 404
            response.end(data.toString())
        })
    }
}).listen(5000)

console.log('Server running at http://localhost:5000/api/name')
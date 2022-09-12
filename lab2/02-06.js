const http = require('http')
const fs = require('fs')

http.createServer(function (request, response) {
    if (request.url == '/jquery') {
        let filepath = './jquery.html'
        fs.readFile(filepath, (err, data) => {
            if (err) response.statusCode = 404
            response.end(data)
        })
    }
}).listen(5000)

console.log('Server running at http://localhost:5000/')
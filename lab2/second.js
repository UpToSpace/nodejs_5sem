const http = require('http')
const fs = require('fs')

http.createServer(function(request, response){
    if (request.url == '/png') {
        let filepath = './pic.png'
    fs.access(filepath, fs.constants.F_OK, err => {
        if (err) {
            response.statusCode = 404
            response.end()
        }
        fs.createReadStream(filepath).pipe(response) 
    })}
}).listen(5000)

console.log('Server running at http://localhost:5000/png')
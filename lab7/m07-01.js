const fs = require('fs')

function checker() {
    this.getExtension = (path) => path.split('.').slice(-1)[0]
    this.sendFile = (headers, request, response) => {
        fs.access('./static' + request.url, fs.constants.F_OK, err => {
            if (err) {
                response.statusCode = 404
                response.end("cannot access file...")
            } else {
                response.writeHead(200, headers)
                fs.createReadStream('./static' + request.url).pipe(response)
            }
        })
    }
}

exports.checker = checker
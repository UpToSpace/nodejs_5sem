const http = require("http")
const m07 = require('./m07-01')

let httpHandler = (request, response) => {
    let checker = new m07.checker()
    let header = {'Content-Type':'text/plain'}
    if (request.method == 'GET') {
        let found = true
        console.log(checker.getExtension(request.url))
        switch (checker.getExtension(request.url)) {
            case 'html':
                header = {'Content-Type':'text/html'}
                break
            case 'css':
                header = {'Content-Type':'text/css'}
                break
            case 'js':
                header = {'Content-Type':'text/javascript'}
                break
            case 'png':
                header = {'Content-Type':'image/png'}
                break
            case 'docx':
                header = {'Content-Type':'application/msword'}
                break
            case 'json':
                header = {'Content-Type':'application/json'}
                break
            case 'xml':
                header = {'Content-Type':'application/xml'}
                break
            case 'mp4':
                header = {'Content-Type':'video/mp4'}
                break
            default:
                response.writeHead(404)
                response.end()
                found = false
                break
        }

        found ? checker.sendFile(header, request, response) : null

    } else {
        response.writeHead(405)
        response.end('http status 405 because of ' + request.method)
    }
}

http.createServer()
    .listen(5000, () => console.log('Server running at http://localhost:5000/'))
    .on('request', httpHandler)
    .on('error', (e) => console.log(e.message))
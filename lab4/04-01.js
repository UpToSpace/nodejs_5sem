const http = require("http")
const fs = require("fs")
const url = require("url")
const db_module = require("./db")

let db = new db_module();

db.on('GET', (req, res) => {
    res.end(JSON.stringify(db.select()))
})
db.on('POST', (req, res) => {
    req.on('data', data => {
        res.end(JSON.stringify(db.insert(JSON.parse(data))))
    })
})
db.on('PUT', (req, res) => {
    req.on('data', data => {
        res.end(JSON.stringify(db.update(JSON.parse(data))))
    })
})
db.on('DELETE', (req, res) => {
    let id = url.parse(req.url, true).query.id;
    req.on('data', data => {
        if (id !='')
            res.end(JSON.stringify(db.delete(id)))
    })
})

http.createServer(function (request, response) {
    let pathname = url.parse(request.url).pathname;

    switch (pathname) {
        case "/api/db":
            db.emit(request.method, request, response)
            break
        case "/":
            let html = fs.readFileSync('./04-01.html');
            response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            response.end(html)
            break
        default:
            break
    }

}).listen(5000)

console.log('Server running at http://localhost:5000/api/db');
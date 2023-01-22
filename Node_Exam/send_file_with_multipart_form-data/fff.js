const http = require('http');
const url = require('url');
const multiparty = require('multiparty')

let server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        if (url.parse(req.url).pathname === '/upload') {
            let form = new multiparty.Form({ uploadDir: "./static" })

            form.parse(req, function (err, fields, files) {
                res.writeHead(200, { 'content-type': 'multipart/form-data' });
                res.end('received upload:\n\n');
            });
        } 
    }
})
server.listen(5000)
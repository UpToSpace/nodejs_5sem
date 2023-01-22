const http = require('http');
const fs = require('fs');
const query = require('querystring');
const multiparty = require('multiparty');

let server = http.createServer((req, res) => {
    if (req.method == 'GET' && req.url == '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(fs.readFileSync('./hts.html'));
    } else
    if (req.method == 'POST' && req.url == '/') {
        let form = new multiparty.Form({uploadDir: './'});
        let data;
        form.parse(req);
        form.on('file', (name, file) => {
            data += file.originalFilename;
        })
        form.on('close', () => {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(data);
        })
    } else if (req.method == 'POST' && req.url == '/xml') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        })
        req.on('end', () => {
            fs.writeFileSync('./xml.xml', data);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(data);
        })
    }

    else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not found');
    }
}).listen(3000);
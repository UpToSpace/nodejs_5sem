const http = require('http');
const fs = require("fs");
const url = require('url');
const { parse } = require('querystring');
const parseString = require('xml2js').parseString;
const xmlbuilder = require('xmlbuilder');
const mp = require("multiparty");

let http_handler = (req, res) => {
    if (req.method === 'GET') {
        switch (url.parse(req.url).pathname) {
            case '/1':
                res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('task 1 response');
                break;
            case '/2':
                let q = url.parse(req.url, true).query;
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                console.log('http.request: statusCode: ', res.statusCode);
                console.log(`x+y=${+q['x'] + (+q['y'])}`);
                res.end(`2 Task`);
                break;
            default:
                break;
        }
    }

    let result = ''
    let body = ''

    if (req.method === 'POST') {
        switch (url.parse(req.url).pathname) {
            case '/3':
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    let o = parse(body);
                    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                    res.end(`x+y+s=${+o['x'] + +o['y'] + o['s']}`);
                });
                break;
            case '/4':
                result = '';
                body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    console.log(body);
                    let os = JSON.parse(body);
                    result = {
                        __comment: "Ответ",
                        x_plus_y: os.x + os.y,
                        Concatination_s_o: os.s + '.' + os.o.surname + "," + os.o.name,
                        Length_m: os.m.length
                    };
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    console.log(result);
                    res.end(JSON.stringify(result));
                }
                    , function (err, reply) {
                        console.log(err && err.stack);
                        console.dir(reply);
                    });
                break;
            case '/5':
                let sumx = 0;
                let resultm = '';
                let id = '';
                body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    console.log(body);
                    parseString(body, function (err, result) {
                        id = result.request.$.id;
                        console.log(id);
                        result.request.m.map((e, i) => {
                            resultm += e.$.value;
                        });
                        result.request.x.map((e, i) => {
                            console.log(e.$.value);
                            sumx += (+e.$.value);
                        });
                    });
                    let result = xmlbuilder.create('response')
                        .att("id", id);
                    result.ele('sum', { element: "x", sum: `${sumx}` });
                    result.ele('concat', { element: "m", result: `${resultm}` });

                    res.writeHead(200, { 'Content-Type': 'application/xml' });
                    console.log(result.toString())
                    res.end(result.toString());
                }
                    , function (err, reply) {
                        console.log(err && err.stack);
                        console.dir(reply);
                    });
                break;
            case '/6':
                result = '';
                let form = new mp.Form({ uploadDir: './static' });
                // form.on('field', (name, value) => {
                //     console.log('------------field-------------');
                //     console.log(name, value);
                //     result += `<br/>---${name}= ${value}`;
                // });
                form.on('file', (name, file) => {
                    console.log('-----file ------------');
                    console.log(name, file);
                    result += `<br/>---${name}= ${file.originalFilename}: ${file.path}`;
                });
                form.parse(req);
                res.end()
                break;
            default:
                break;
        }
    }

    if (req.method === 'GET' && url.parse(req.url).pathname.startsWith('/8/')) {
        fs.access('static/' + url.parse(req.url).pathname.split('/')[2], fs.constants.F_OK, err => {
            if (err) {
                res.statusCode = 404
                res.end("cannot access file...")
            } else {
                res.writeHead(200)
                fs.createReadStream('./static/' + url.parse(req.url).pathname.split('/')[2]).pipe(res)
            }
        })
    }
}

var server = http.createServer(function (req, res) {
    http_handler(req, res);
})
    .listen(5000, () => {
        console.log('Server running at http://localhost:5000/');
    })
    .on('error', (e) => {
        console.log('Server running at http://localhost:5000/ : ERROR = ', e.code);
    })
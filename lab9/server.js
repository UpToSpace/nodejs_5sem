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

    var result = ''
    var body = ''

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
                let result1='';
                let body='';
                req.on('data',chunk=>{body+=chunk.toString();});
                req.on('end',()=>{
                    console.log(body);
                    let os = JSON.parse(body);
                    result1={
                        __comment:"Ответ.Лабораторная работа 8/10",
                        x_plus_y:os.x+os.y,
                        Concatination_s_o:os.s+'.'+os.o.surname+","+os.o.name,
                        Length_m:os.m.length
                    };
                    res.writeHead(200,{'Content-Type': 'application/json'});
                    console.log(result1);
                     res.end(JSON.stringify(result1));}
                    ,function(err,reply){
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
                let result = '';
                let form = new mp.Form({ uploadDir:'./static' });
                form.parse(req);
                form.on('field',(name, field)=>{
                    console.log('---- got a field:');
                    console.log(name, field);
                    result += `<br/>${name} = ${field}`;
                });
                form.on('file', (name, file)=>{
                    console.log('---- got a file:');
                    console.log(name, file);
                    result += `<br/>${name} = original name: ${file.originalFilename}; path: ${file.path}`;
                });
                form.on("error", (err) => {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end("<h2>form error</h2>");
                });
                form.on("close", () => {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.write("<h2>success! form data:</h2>");
                    res.end(result);
                });
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
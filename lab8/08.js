const http = require('http')
const url = require('url')
const qs = require('querystring')
const fs = require('fs')
const xml2js = require('xml2js')
const xmlbuilder = require('xmlbuilder')
const mp = require('multiparty')

let httpHandler = (request, response) => {
    if (request.method == 'GET') {
        console.log(request.url)
        let parsedUrl = url.parse(request.url, true)
        let pathname = parsedUrl.pathname.split('/')[1]
        switch (pathname) {
            // case '/connection':
            //     break
            case 'connection':
                if (!parsedUrl.query.set) {
                    response.end('keepAliveTimeout: ' + server.keepAliveTimeout)
                } else {
                    let time = +parsedUrl.query.set
                    server.keepAliveTimeout = time
                    response.end('keepAliveTimeout set: ' + time)
                }
                break
            case 'headers':
                response.setHeader('X-Author', 'me')
                response.write('request headers: '.toUpperCase() + '\n')
                for (let header in request.headers) {
                    response.write(header + ": " + request.headers[header] + '\n')
                }

                response.write('\n\n\nresponse headers: '.toUpperCase() + '\n')
                for (let header in response.getHeaders()) {
                    response.write(header + ": " + response.getHeaders()[header] + '\n')
                }
                response.end()
                break
            case 'parameter':
                if (parsedUrl.query.x && parsedUrl.query.y) {
                    let x = parseInt(parsedUrl.query.x)
                    let y = parseInt(parsedUrl.query.y)
                    if (x && y) {
                        response.end(`x + y = ${x + y}\nx - y = ${x - y}\nx * y = ${x * y}\nx / y = ${x / y}\n`)
                    } else {
                        response.end('error in query params')
                    }
                } else {
                    let parsedPathname = parsedUrl.pathname.split('/')
                    x = parseInt(parsedPathname[2])
                    y = parseInt(parsedPathname[3])
                    if (x && y) {
                        response.end(`x + y = ${x + y}\nx - y = ${x - y}\nx * y = ${x * y}\nx / y = ${x / y}\n`)
                    } else {
                        response.end(parsedUrl.pathname)
                    }
                }
                break
            case 'close':
                response.setHeader('Connection', 'close');
                response.end('Server will be closed in 10 sec')
                setTimeout(() => server.close(() => console.log('server closed')), 10 * 1000)
                break
            case 'socket':
                response.write('client port: ' + response.socket.remotePort + '\n');
                response.write('client ip: ' + response.socket.remoteAddress + '\n');
                response.write('server port: ' + response.socket.localPort + '\n');
                response.end('server ip: ' + response.socket.localAddress);
                break
            case 'req-data':
                let result = 0
                request.on('data', (data) => {
                    console.log(data.length)
                    result += data.length
                })
                request.on('end', () => console.log("data length = " + result))
                response.end()
                break
            case 'resp-status':
                let code = parseInt(parsedUrl.query.code)
                let message = parsedUrl.query.mess
                if (code < 600 && code > 99) {
                    response.statusCode = code
                    response.statusMessage = message
                    //response.writeHead(code, message)
                    response.end()
                }
                break
            case 'formparameter': //post
                response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                fs.readFile('d:/University/cross/labs/lab8/form.html', (err, data) => err ? console.log(err) : response.end(data))
                break
            case 'files':
                if (parsedUrl.pathname.split('/')[2] != null) {
                    fs.access('./static/' + request.url.split('/')[2], fs.constants.F_OK, err => {
                        if (err) {
                            response.statusCode = 404
                            response.end("cannot access file...")
                        } else {
                            response.writeHead(200)
                            fs.createReadStream('./static/' + request.url.split('/')[2]).pipe(response)
                        }
                    })
                } else {
                    fs.readdir("./static", (err, files) => {
                        if (err) {
                            res.end("./static directory not found");
                            return;
                        }
                        response.setHeader("X-static-files-count", `${files.length}`);
                        response.end();
                    });
                }
                break
            case 'upload':
                response.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
                response.end(fs.readFileSync('./upload.html'))
                break
            default:
                response.end('no path')
                break
        }
    }

    if (request.method == 'POST') {
        switch (url.parse(request.url, true).pathname) {
            case '/formparameter':
                let body = ''
                let result = ''
                request.on('data', chunk => body += chunk.toString())
                request.on('end', () => {
                    console.log(body)
                    body = qs.parse(body)
                    for (let key in body) { result += `${key}=${body[key]}<br/>` }
                    response.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                    response.end(result)
                }
                )
                break;
            case '/json':
                // {
                //     "__comment": "REquest. laba 8",
                //     "x": 1,
                //     "y": 2,
                //     "s": "Message",
                //     "m": ["a", "b", "c", "d"],
                //     "o": {"surname": "Korzhova", "name": "Valerie"}
                // }
                let jsonbody = ''
                let jsonresult = {}
                request.on('data', chunk => jsonbody += chunk.toString())
                request.on('end', () => {
                    console.log(jsonbody)
                    jsonbody = JSON.parse(jsonbody)
                    jsonresult = {
                        "__comment": "Response. laba 8",
                        "x_plus_y": jsonbody.x + jsonbody.y,
                        "Concatination_s_o": jsonbody.s + jsonbody.o.surname + jsonbody.o.name,
                        "Length_m": jsonbody.m.length
                    }
                    response.writeHead(200, { 'Content-Type': 'application/json' })
                    response.end(JSON.stringify(jsonresult))
                }
                )
                break;
            case '/xml':
                // <request id = "23">
                //     <x value = "1" />
                //     <x value = "2" />
                //     <m value = "a" />
                //     <m value = "b" />
                //     <m value = "c" />
                // </request>
                let xmlbody = ''
                let xmlresult = ''
                request.on('data', chunk => xmlbody += chunk.toString())
                request.on('end', () => {
                    xml2js.parseString(xmlbody, (err, result) => {
                        if (err) {
                            console.log(err.message)
                            return
                        }
                        let sum = 0
                        result.request.x.forEach(e => sum += +e.$.value)
                        let message = ''
                        result.request.m.forEach(e => message += e.$.value)

                        let xmlresponse = xmlbuilder.create('response')
                            .att("id", Math.round(Math.random() * 100))
                            .att("request", result.request.$.id);
                        xmlresponse.ele('sum', { element: "x", sum: `${sum}` });
                        xmlresponse.ele('concat', { element: "m", result: `${message}` });

                        rc = xmlresponse.toString({ pretty: true });
                        response.writeHead(400, { "Content-Type": "text/xml; charset=utf-8" });
                        response.end(xmlresponse.toString({ pretty: true }));
                    })
                })
                break;
            case '/upload':
                let form = new mp.Form({ uploadDir: './static' });
                form.on('file', (name, file) => { 
                    console.log(`name = ${name}; original filename: ${file.originalFilename}; path = ${file.path}`);
                });
                form.on('error', (err) => {response.end('an error occured')});
                form.on('close', () => {
                    response.writeHead(200, {'Content-type': 'text/plain'});
                    response.end("file uploaded!");
                });
                form.parse(request);
                break;
            default:
                response.end('no path')
                break;
        }
    }
}

let server = http.createServer()
    .listen(5000, () => {
        // console.log('Server running at http://localhost:5000/')
        console.log('Server running at http://localhost:5000/connection')
        console.log('Server running at http://localhost:5000/connection?set=6000')
        console.log('Server running at http://localhost:5000/headers')
        console.log('Server running at http://localhost:5000/parameter?x=10&&y=6')
        console.log('Server running at http://localhost:5000/parameter/2/4')
        console.log('Server running at http://localhost:5000/close')
        console.log('Server running at http://localhost:5000/socket')
        console.log('Server running at http://localhost:5000/req-data')
        console.log('Server running at http://localhost:5000/resp-status?code=404&mess=notfound')
        console.log('Server running at http://localhost:5000/formparameter')
        console.log('Server running at http://localhost:5000/json')
        console.log('Server running at http://localhost:5000/xml')
        console.log('Server running at http://localhost:5000/files')
        console.log('Server running at http://localhost:5000/files/filename')
        console.log('Server running at http://localhost:5000/upload')
    })
    .on('request', httpHandler)
    .on('error', (e) => console.log(e.message))
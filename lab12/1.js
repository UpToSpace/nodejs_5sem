const http = require('http')
const fs = require('fs')
const url = require('url');
const ws = require('ws');

let filepath = 'D:/University/cross/labs/lab12/StudentList.json'

let readJsonFile = () => {
    fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err)
            return console.log('cannot access file')
    })
    return JSON.parse(fs.readFileSync(filepath))
}

let wsServer = new ws.Server({ port: 4001, host: 'localhost', path: '/broadcast' });

wsServer.on('connection', (ws) => {
    fs.watch(filepath, { encoding: 'buffer' }, (eventType, filename) => {
        if (eventType === 'change') {
            wsServer.clients.forEach((client) => {
                if (client.readyState === ws.OPEN) {
                    client.send(`File ${filename} was changed`);
                }
            });
        }
    });

    fs.readdir('./files', (err, files) => {
        for (let i = 0; i < files.length; i++) {
            fs.watch(('./files/' + files[i]), {encoding: 'buffer'}, (eventType, filename) => {
                if(eventType === 'change') {
                    wsServer.clients.forEach((client) => {
                        if (client.readyState === ws.OPEN) {
                            client.send(`File ${filename} was modified`);
                        }
                    });
                }
            });
        }
    });
});
wsServer.on('error', (e) => { console.log('ws server error', e); });
console.log(`WS server: host: ${wsServer.options.host}, port: ${wsServer.options.port}, path: ${wsServer.options.path}`);

let server = http.createServer((request, response) => {

    let pathname = url.parse(request.url).pathname
    if (request.method === 'GET') {
        if (pathname == '/') {
            response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
            response.end(JSON.stringify(readJsonFile()))
        }

        if (pathname == '/backup') {
            fs.readdir('./files', (err, files) => {
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' }); let json = [];
                let listOfBackups = [];
                for (let i = 0; i < files.length; i++) {
                    if (files[i].includes('_StudentList')) {
                        listOfBackups.push({
                            id: i,
                            name: files[i]
                        });
                    }
                }
                response.end(JSON.stringify(listOfBackups));
            });
        }
        if (/\/\d+/.test(pathname)) {
            let n = + pathname.split('/')[1];
            response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
            let data = JSON.stringify(readJsonFile().find(el => el.id == n))
            data === undefined ? response.end('Theres no element with this id') : response.end(data)
        }
    }

    if (request.method === 'POST') {
        if (pathname == '/') {
            let body = '';
            let file = readJsonFile()
            let elementExists = false

            request.on('data', function (data) {
                body += data.toString();
            });

            request.on('end', () => {
                body = JSON.parse(body)
                file.forEach(e => {
                    if (e.id === body.id) {
                        return elementExists = true
                    }
                });
                if (elementExists) {
                    response.end('This id already used')
                } else {
                    file.push(body)
                    fs.writeFile(filepath, JSON.stringify(file), e => {
                        if (e) {
                            console.log('error during adding')
                        }
                        console.log('New student added');
                        response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        response.end(JSON.stringify(body));
                    })
                }
            })
        }

        if (pathname === '/backup') {
            setTimeout(() => {
                let date = new Date();
                let name = '';
                name += date.getFullYear();
                name += date.getMonth() + 1;
                date.getDate() < 10 ? name += '0' + date.getDate() : name += date.getDate();
                date.getHours() < 10 ? name += '0' + date.getHours() : name += date.getHours();
                date.getMinutes() < 10 ? name += '0' + date.getMinutes() : name += date.getMinutes();
                name += "_StudentList.json";
                fs.copyFile(filepath, './files/' + name, (e) => {
                    if (e) {
                        console.log('error ' + e.message);
                        response.end('error ' + e.message)
                    }
                    else {
                        console.log('Backup successfully created');
                        response.end('Backup successfully created');
                    }
                });
            }, 2 * 1000)

        }
    }

    if (request.method === 'PUT') {
        if (pathname == '/') {
            let body = '';
            let file = readJsonFile()
            let elementId

            request.on('data', function (data) {
                body += data.toString();
            });

            request.on('end', () => {
                body = JSON.parse(body)
                file.forEach(e => {
                    if (e.id === body.id) {
                        elementId = e.id
                        e.name = body.name
                        e.faculty = body.faculty
                        return
                    }
                });
                if (!elementId) {
                    response.end('This id not found')
                } else {
                    fs.writeFile(filepath, JSON.stringify(file), e => {
                        if (e) {
                            console.log('error during adding')
                        }
                        console.log('Student changed');
                        response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        response.end(JSON.stringify(body));
                    })
                }
            })
        }
    }

    if (request.method === 'DELETE') {
        if (/\/backup\/\d{8}/.test(pathname)) {
            let n = + pathname.split('/')[2]
            fs.readdir('D:/University/cross/labs/lab12/files', null, (err, files) => {
                files.map(fileName => {
                    if (fileName.includes('StudentList') && +fileName.split('_')[0] < n) {
                        fs.unlink('./files/' + fileName, e => {
                            if (e) {
                                console.log(`error during delete ${fileName}`)
                            } else {
                                console.log(`file ${fileName} deleted`)
                                response.write(`file ${fileName} deleted`)
                            }
                        })
                    }
                })
                response.end()
            })
        }
        else if (/\/\d+/.test(pathname)) {
            let n = + pathname.split('/')[1];
            let file = readJsonFile()

            let index = file.findIndex(e => e.id === n)
            if (index === -1) {
                response.end('This id not found')
            } else {
                let element = file[index]
                file.splice(index, 1)
                fs.writeFile(filepath, JSON.stringify(file), e => {
                    if (e) {
                        console.log('error during adding')
                    }
                    console.log('Student deleted');
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify(element));
                })
            }
        }
    }

    fs.watch(filepath, (event,f)=>
    {
        if(f) wsServer.emit("change");
    })
}).listen(3000)

console.log('Server running at http://localhost:3000/');
const http = require("http")
const fs = require("fs")
const url = require("url")
const db_module = require("./db");

let db = new db_module();
let timerSd = null;
let timerSc = null;
let timerSs = null;
let commitNumber = 0;
let requestNumber = 0;
let startStat = 'no stat';
let endStat = 'no stat';

//listeners
db.on('GET', (req, res) => {
    res.end(JSON.stringify(db.select()))
    requestNumber++
})
db.on('POST', (req, res) => {
    req.on('data', data => {
        res.write("{ \"database\": " + JSON.stringify(db.insert(JSON.parse(data))))
        res.end(", \"message\": " + JSON.stringify(db.message) + " }")
    })
    requestNumber++
})
db.on('PUT', (req, res) => {
    req.on('data', data => {
        res.write("{ \"database\": " + JSON.stringify(db.update(JSON.parse(data))))
        res.end(", \"message\": " + JSON.stringify(db.message) + " }")
    })
    requestNumber++
})
db.on('DELETE', (req, res) => {
    let id = url.parse(req.url, true).query.id;
    req.on('data', data => {
        if (id != '') {
        res.write("{ \"database\": " + JSON.stringify(db.delete(id)))
        res.end(", \"message\": " + JSON.stringify(db.message) + " }")      
        }      
    })
    requestNumber++
})

let server = http.createServer(function (request, response) {
    let pathname = url.parse(request.url).pathname;

    switch (pathname) {
        case "/api/db":
            db.emit(request.method, request, response)
            break
        case "/api/ss":
            response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            response.end(JSON.stringify(printStat()))
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

console.log('Server running at http://localhost:5000/api/ss');

function printStat() {
    return {start: startStat, finish: endStat, request: requestNumber, commit: commitNumber}
}
process.stdin.setEncoding('utf-8')
process.stdin.on('readable', () => {
    let command = null;
    while ((command = process.stdin.read()) != null) {
        let argument = command.trim().substring(2);
        //console.log(argument.search(/[\d]/g))
        if (argument.search(/[\d]/g) !== -1 || argument == '') { 
            let commandName = command.trim().substring(0, 2)
            console.log(`commandName: ${commandName} argument: ${argument}`);
            switch (commandName) {
                case 'sd':
                    if (argument.length == 0) {
                        clearTimeout(timerSd);                 
                    } else {
                        timerSd = setTimeout(() => 
                        {
                            process.stdin.unref();
                            server.close(() => console.log('server closed'));
                        }, argument * 1000)
                        console.log('server will be closed in ' + argument)
                    }
                    break
                case 'sc':
                    if (argument.length == 0) {
                        clearInterval(timerSc)
                    } else {
                        timerSc = setInterval(() => {
                            db.commit();
                            commitNumber++;
                            console.log('committed')
                        }, argument * 1000)
                        timerSc.unref();
                    }
                    break
                case 'ss':
                    if (argument.length == 0) {
                        clearTimeout(timerSs)
                        console.log('stat is cancelled')
                    } else {
                        console.log('stat will be printed in ' + argument)
                        startStat = new Date().toLocaleTimeString();
                        timerSs = setTimeout(() => 
                        endStat = new Date().toLocaleTimeString(), argument * 1000).unref()
                    }
                    break
                default:
                    console.log('command is wrong... ' + command)
                    break;
            }
        }
    }
})
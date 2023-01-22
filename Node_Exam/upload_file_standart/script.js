let http = require("http");
let fs = require("fs");
let url = require("url");
const multiparty = require('multiparty');

let port = 8080;
let host = `localhost`;

let httpServer = http.createServer((request, response) => {
    let reqPath = url.parse(request.url).pathname;
    let reqMethod = request.method;
    const path = url.parse(request.url, true);
    switch (reqMethod) { //выбор метода
        case "GET": { //если GET
            switch (reqPath) { //проверка пути 
                case "/": {
                    response.writeHead(200, {
                        "Content-Type": "text/html; charset=utf-8"
                    });
                    response.end(fs.readFileSync("index.html"));
                    break;
                }
            }
        }
        case "POST": { //если POST
            switch (reqPath) { //проверка пути
                case "/": {
                    let form = new multiparty.Form({
                        uploadDir: "./static"
                    });
                    form.on("field", (name, value) => {

                    });
                    form.on("file", (name, file) => {
                        console.log(`name = ${name}; original filename: ${file.originalFilename}; path = ${file.path}`);
                    });
                    form.on("error", (err) => {
                        response.writeHead(200, {
                            "Content-Type": "text/plain; charset=utf-8"
                        });
                        response.end(`${err}`);
                    });
                    form.on("close", () => {
                        response.writeHead(200, {
                            "Content-Type": "text/plain; charset=utf-8"
                        });
                        response.end("Файл успешно загружен");
                    });
                    form.parse(request);
                    break;
                }
            }
        }
    }
}).listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`)
});
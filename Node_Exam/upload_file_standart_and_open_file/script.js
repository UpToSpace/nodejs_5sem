let http = require("http");
let fs = require("fs");
let url = require("url");
const multiparty = require('multiparty');

let port = 8080;
let host = `localhost`;

const MIME = {
    HTML: Symbol('text/html; charset=utf-8'),
    CSS: Symbol('text/css'),
    JS: Symbol('text/javascript'),
    PNG: Symbol('image/png'),
    DOCX: Symbol('application/msword'),
    JSON: Symbol('application/json'),
    XML: Symbol('application/xml'),
    MP4: Symbol('video/mp4')
};

function getHeader(mime) {
    return {
        'Content-Type': mime.description
    };
}

res404 = (response, url, mime) => {
    const statusCode = 404;
    response.writeHead(statusCode, getHeader(mime));
    response.end(`Error ${statusCode}<br>Url: ${url}`);
}

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

                default: { //написать обработчки для файлов 
                    if (path.pathname.slice(1).split("/")[0] === "files") {
                        let arrayPath = path.pathname.slice(1).split("/");
                        let fileName = arrayPath[1];
                        if (fs.existsSync(`./static/${fileName}`)) {
                            fs.access(`./static/${fileName}`, fs.constants.R_OK, () => {
                                response.writeHead(200, {
                                    "Content-Type": "application/txt; charset=utf-8"
                                });
                                fs.createReadStream(`./static/${arrayPath[1]}`).pipe(response);
                            });
                        } else {
                            res404(response, request.url, MIME.HTML);
                        }
                        break;
                    }
                    console.log("GET: Not Found")
                    response.writeHead(404);
                    response.end("404: Not Found");
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
const http = require('http')
const url = require('url')
const fs = require('fs')

let factorial = (k) => {
    if (k == 0) {
        return 1;
    }
    return k * factorial(k - 1);
}

function Factor(n, cb) {
    this.fn=n;
    this.ffactorial=factorial;
    this.fcb=cb;
    this.calc= ()=>{setImmediate(()=>{this.fcb(null, this.ffactorial(this.fn));});}
}

http.createServer((request, response) => {
    if (url.parse(request.url).pathname === '/fact') {
        let host = request.url;
        if (url.parse(host, true).query.k === "x") {
            fs.readFile("./03-03.html", (err, data) => {
                response.end(data);
            });
        }
        else {
            let parsedUrl = url.parse(host, true).query;
            let f = new Factor(parseInt(parsedUrl.k), (err, result) => {response.end(JSON.stringify({ k:parseInt(parsedUrl.k) , factorial : result}))})
            response.writeHead(200, { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*", });
            f.calc();
        }
    }
}).listen(5000)

console.log('Server running at http://localhost:5000/fact?k=3');
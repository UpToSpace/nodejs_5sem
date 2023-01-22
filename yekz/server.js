const http = require('http')
const fs = require('fs')

http.createServer((req, res) => {
    if (req.method == 'POST' && req.url == '/') {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', () => {            
            if(!JSON.parse(data).age || !JSON.parse(data).name) {
                res.statusCode = 400;
                res.end();
                return;
            }
            fs.writeFile('./client.json', data, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
                res.end('The file has been saved!');
            })
        })
    } else {
        res.statusCode = 404;
        res.end();
    }
}).listen(3000)
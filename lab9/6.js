const http = require('http');
const fs = require('fs');

let bound = 'heyheyhey';
let body = `--${bound}\r\n`;
    body += 'Content-Disposition: form-data; name="file"; filename="MyFile.txt"\r\n';
    body += 'Content-Type: text/plain\r\n\r\n';
    body += fs.readFileSync("MyFile.txt");
    body += `\r\n--${bound}--\r\n`;

let options = {
    host: 'localhost',
    path: '/6',
    port: 5000,
    method: 'POST',
    headers: {
        'Content-Type': `multipart/form-data; boundary=${bound}`
    }
}

const req = http.request(options, (res) => {
    console.log(`res.response (statusCode) = ${res.statusCode}`);
});

req.on('error', (e) => {
    console.log(`http.request: error: ${e.message}`);
});
req.end(body);
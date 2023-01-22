const http = require('http');
const url = require('url');
const fs = require('fs')

let server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        if (url.parse(req.url).pathname === '/upload') {
            const formidable = require('formidable');

            let form = new formidable.IncomingForm();
            console.log(form)
            form.uploadDir =  "./static";
            form.parse(req, function (err, fields, files) {
                let oldpath = files.file.filepath;
                let newpath = './static/' + files.file.newFilename + '-' + files.file.originalFilename
                fs.rename(oldpath, newpath, function (err) {

                });
            });
            res.write('File uploaded.');
            res.end();
        }
    }
})
server.listen(5000)
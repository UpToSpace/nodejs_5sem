const http = require('http')
const fs = require('fs')
const url = require('url')
const nodemailer = require("nodemailer")
const { parse } = require('querystring');
const config = require('./config')

http.createServer(function(request, response) {
    switch(url.parse(request.url).pathname) {
        case "/":
            if (request.method == "GET") {
                response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                response.end(fs.readFileSync('./06-02.html'))
            }
            if (request.method == "POST") {
                let data = '';
                request.on("data", (chunk) => data += chunk.toString())

                request.on("end", () => {
                    data = parse(data)
                    
                    console.log(data)

                    const transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: config.mail,
                            pass: config.mailpassword,
                        },
                    });
                    
                    const options = {
                        from: config.mail,
                        to: data.receiverEmail,
                        subject: data.subject,
                        text: data.message,
                    }
        
                    transporter.sendMail(options, (err, info) => {
                        if(err) {
                            console.log(err);
                            return;
                        }
                        console.log("Sent: " + info.response);
                    })
        
                    response.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
                    response.end(`<h1>Sent from ${config.mail} to ${data.receiverEmail}: ${data.message}</h1>`);
                })
            }
            break
    }
}).listen(5000)

console.log('Server running at http://localhost:5000/');

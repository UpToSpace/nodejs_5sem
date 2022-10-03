const http = require('http')

http.createServer((request, response) => {
    let state = 'norm';
    response.contentType = 'text/html';
    response.write(`<h1> ${state} </h1>`);

    process.stdin.setEncoding('utf-8');
    process.stdin.on('readable', () => {
        while ((state = process.stdin.read()) != null) {
            switch (state.trim()) {
                case 'stop':
                case 'norm':
                case 'test':
                case 'idle':
                    process.stdout.write(`State changed -> ${state} \n`);
                    response.write(`<h1> ${state} </h1>`);
                    break;
                case 'exit':
                    process.exit(0);
                    break;
                default:
                    response.write(`<h1> ${state} </h1>`);
                    break;
            }

        }
    })
}).listen(5000)

//console.log('Server running at http://localhost:5000/');
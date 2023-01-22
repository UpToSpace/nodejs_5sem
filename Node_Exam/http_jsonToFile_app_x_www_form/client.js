let http = require('http');
let data = 'name=ira&age=20';//формат передачи енкодед

let client= http.request( {hostname: 'localhost',
port:3000,
headers:{'Content-Type': 'application/x-www-form-urlencoded',
'Content-Length':data.length}});
client.end(data,()=>{
    console.log('data send.')
});
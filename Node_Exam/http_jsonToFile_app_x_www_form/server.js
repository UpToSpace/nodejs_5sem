let http= require('http');
let {parse} =require('querystring');// npm add querystring
let fs=require('fs');

let server = http.createServer(function(req,resp){

req.on('data',(data)=>{
  let  parm=parse(data.toString());
   // console.log(`message: ${parm.age},${parm.name}.`)
   let json = JSON.stringify(parm);
   fs.writeFileSync('myFile.json',json);
});

}).listen(3000,'localhost',()=>{ console.log('server start!');})
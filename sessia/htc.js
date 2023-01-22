const axios = require('axios');
const http = require('http');
const query = require('querystring');
const xml = require('xml2js');
const xmlbuilder = require('xmlbuilder');

{/* <students class="1V" year="2019">
    <student name="Jake" age="22" gender="m">
        <phone>123456789</phone>
    </student>
</students> */}


let str = xmlbuilder.create('students', { version: '1.0', encoding: 'UTF-8' })
    .att('class', '1V')
    .att('year', '2019')
    .ele('student', { name: 'Jake', age: 22, gender: "m"})
    .ele('phone', '123456789')
    .up()
    .end({ pretty: true });

let req = http.request({path: '/xml', host: 'localhost', method: 'POST', port: 3000, headers: {'Content-Type': 'text/xml'}}, (res) => {
})

req.write(str);
req.end();
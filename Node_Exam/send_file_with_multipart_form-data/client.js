const axios = require('axios')
const FormData = require('form-data');

const form = new FormData();
const fs = require('fs');
form.append('file', fs.createReadStream('./data.json')); 

axios({
    method: 'post',
    url: 'http://localhost:5000/upload',
    // data: './data.json',
    headers: form.getHeaders(),
    data: form
})
    .then(function (response) {
        console.log('file upload')

    });
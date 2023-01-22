const axios = require('axios');
const fs= require('fs');

axios({url: 'http://localhost:3000/?name=lera&age=20', method: 'post', contentType: 'application/json'})
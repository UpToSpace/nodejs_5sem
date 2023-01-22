const axios = require('axios')

axios({method: 'POST', url: 'http://localhost:3000', data: JSON.stringify({name: "lll", age: 82}), headers: {'Content-Type': 'application/json'}})
.then(res => {
    console.log(res.data)
})
.catch(err => {
    console.log(err.response.status + ' ' + err.response.statusText)
})


//JSON.stringify({name: "Jack", age: 22})
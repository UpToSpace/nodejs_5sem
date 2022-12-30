const websocket = require('ws');
const ws = new websocket('ws://localhost:4001/broadcast', {transports: ['websocket']});

ws.onopen = () => {
    console.log('socket.onopen() ');
    ws.on('message', (message) => {
        console.log('Message: ', message.toString());
    });
}
ws.onclose = (e) => { console.log('socket.onclose() '); }
ws.onerror = function(err) { console.log('ERROR: ' + err.message);}
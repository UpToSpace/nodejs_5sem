var http = require('http');

let head = (request) => {
	let rc = '';
	for (let key in request.headers)
		rc += '<h3><span>' + key + ':</span> ' + request.headers[key] + '</h3>';
	return rc;
};

http.createServer(function(request, response) {
	let body = '';
	request.on('data', str => {
		body += str;
		console.log('data', body);
	});

	response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
	
    request.on('end', () => response.end(
			'<!DOCTYPE html><html lang=\"en\"><head></head>' +
			'<body>' +
			'<h1>Request structure</h1>' +
			'<h3><span>method:</span> ' + request.method + '</h3>' +
			'<h3><span>uri:</span> ' + request.url + '</h3>' +
			'<h3><span>ver:</span> ' + request.httpVersion + '</h3>' +
			'<h3><span>headers:</span> ' + head(request) + '</h3>' +
			'<h3><span>body:</span> ' + body + '</h3>' +
			'</body>' +
			'</html>'
		)
	)
}).listen(3000);

console.log('Server running at http://localhost:3000/');
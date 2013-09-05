

// Variables
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

// Send 404 error response.
function send404(response) {
	response.writeHead(404, {
		'Content-Type' : 'text/plain'
	});
	response.write('Error 404: resource not found.');
	response.end();
}

// Send file data.
function sendFile(response, filePath, fileContents) {
	response.writeHead(200, {
		"content-type" : mime.lookup(path.basename(filePath))
	});
	response.end(fileContents);
}

// Serving static files.
function serveStatic(response, cache, absPath) {
	if (cache[absPath]) {
		sendFile(response, absPath, cache[absPath]);
	} else {
		fs.exists(absPath, function (exists) {
			if (exists) {
				fs.readFile(absPath, function (err, data) {
					if (err) {
						send404(response);
					} else {
						cache[absPath] = data;
						sendFile(response, absPath, data);
					}
				});
			} else {
				send404(response);
			}
		});
	}
}

// Create an HTTP server.
var server = http.createServer(function (request, response) {
		var filePath = false;

		if (request.url == '/') {
			filePath = 'public/index.html';
		} else {
			filePath = 'public' + request.url;
		}

		var absPath = './' + filePath;
		serveStatic(response, cache, absPath);
	});

// Start the HTTP server.
server.listen(5176, function () {
	console.log("Server listening on port 5176.");
});

// Set up Socket.io server
var chatServer = require('./lib/chat_server');
chatServer.listen(server);












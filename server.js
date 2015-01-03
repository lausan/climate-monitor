var net = require('net');
var http = require('http');

var current;

net.createServer(function(socket) {

  var data = '';

  socket.on('data', function(buf) {
    data += buf;
  });

  socket.on('end', function() {
    current = JSON.parse(data);
    console.log('received:', current);
    current.date = new Date();
    socket.end();
  });

}).listen(5001);

http.createServer(function(req, res) {
  if (req.method === 'GET') {
    console.log('sending:', JSON.stringify(current));
    res.end(JSON.stringify(current));
  }
}).listen(5000);

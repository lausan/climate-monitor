var net = require('net');
var http = require('http');

var Datastore = require('nedb');
var db = new Datastore({
  filename: __dirname + '/data/climate.db',
  autoload: true
});

net.createServer(function(socket) {

  var data = '';

  socket.on('data', function(buf) {
    data += buf;
  });

  socket.on('end', function() {
    data = JSON.parse(data);
    console.log('received:', data);
    data.date = new Date();
    db.insert(data, function(err) {
      if (err) {
        console.log(err);
      }
    });
    socket.end();
  });

}).listen(5001);

http.createServer(function(req, res) {
  if (req.method === 'GET') {
    db.find({}).sort({ date: -1 }).limit(100).exec(function(err, docs) {
      if (err) {
        console.log(err);
        res.writeHead(500);
        res.end({ error: err });
        return;
      }
      res.end(JSON.stringify(docs));
    });
  }
}).listen(5000);

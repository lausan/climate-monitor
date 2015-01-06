var net = require('net');
var tessel = require('tessel');
var climateLib = require('climate-si7020');
var argv = process.argv.slice(2);

var debug = argv.indexOf('debug') !== 1;
var port = defaultArg(argv, 'port', 5001, 'int');
var host = defaultArg(argv, 'host', '54.225.94.80');
var interval = defaultArg(argv, 'interval', 60 * 1000, 'int');
var fahrenheit = defaultArg(argv, 'f', 1, 'int') ? 'f' : 'c';

var climate = climateLib.use(tessel.port.A);

debug && console.log(argv);

climate.on('ready', function() {
  debug && console.log('connected to si7020');

  setImmediate(function loop() {

    climate.readTemperature(fahrenheit, function(err, temp) {
      climate.readHumidity(function(err, humid) {
        var options = {
          host: host,
          port: port
        };
        var payload = {
          temp: temp.toFixed(4),
          rh: humid.toFixed(4)
        };
        debug && console.log(payload);
        debug && console.log(JSON.stringify(payload));
        var client = net.connect(options, function() {
          client.write(JSON.stringify(payload));
          client.end();
          setTimeout(loop, interval);
        });
        client.on('error', function() {
          setTimeout(loop, interval);
        });
      });
    });

  });
});

climate.on('error', function(err) {
  console.log('error connecting module', err);
});


function defaultArg(args, name, def, type) {
  var re = new RegExp("^" + name);
  return args.reduce(function(memo, item) {
    if (item.match(re)) {
      memo = item.split('=').pop();
      if (type == 'int') {
        memo = parseInt(memo, 10);
      }
    }
    return memo;
  }, def);
}

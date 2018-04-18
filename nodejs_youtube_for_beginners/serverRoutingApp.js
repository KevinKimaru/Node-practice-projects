var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res) {
  if (req.url === '/home' || req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(__dirname + '/index.html', 'utf8').pipe(res);
  } else if (req.url === '/contact') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(__dirname + '/contact.html', 'utf8').pipe(res);
  } else if (req.url === '/api/person') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    var myJsonObj = {
      name: 'Kevin',
      age: 18,
      schools: {
        primary: 'Kerugoya Good Shepherd',
        secondary: 'Starehe',
        university: 'Kenyatta'
      }
    };
    res.end(JSON.stringify(myJsonObj));
  } else {
    res.writeHead(404, {'Content-Type': 'text/html'});
    fs.createReadStream(__dirname + '/404error.html', 'utf8').pipe(res);
  }
});

server.listen(3000, '127.0.0.1');
console.log('Listening to port 3000');

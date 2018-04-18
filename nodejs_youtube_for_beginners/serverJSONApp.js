var http = require('http');

var server = http.createServer(function(req, res) {
  console.log('URL is: ' + req.url);
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
});

server.listen(3000, '127.0.0.1');
console.log('Listening to port 3000');

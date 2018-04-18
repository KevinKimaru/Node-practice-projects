var http = require('http');
var express = require('express');
var os = require('os');

var app = express();
app.set('port', process.env.PORT || 3500);

app.use(function(req, res, next){
  //create a domain for this request
  var domain = require('domain').create();
  //hanle errors on this domain
  domain.on('error', function(err) {
    console.error('DOMAIN ERROR CAUGHT:\n',err.stack);
    try{
      //failsafe shutdown in 5 seconds
      setTimeOut(function(){
        console.error('Failsafe shutdown.');
        process.exit(1);
      }, 5000);

      //disconnect from the cluster
      var worker = require('cluster').worker;
      if(worker) worker.disconnect();

      //Stop taking new requests
      server.close();

      try {
        //try to use express error route
        next(err);
      }catch(err) {
        //if express route refused, try plain node response
        console.error('Express error mechanism failed.\n', err.stack);
        res.statusCode = 500;
        res.setHeader('content-type', 'text/plain');
        res.end('Server error.');
      }
    }catch(err) {
       console.error('Unable to send 500 response.\n', err.stack);
    }

    //Add the req and res objects to the DOMAIN
    domain.add(req);
    domain.add(res);

    //execute the rest of the domain chain in the DOMAIN
     domain.run(next);
  });
});

app.use(function(req,res,next){
  var cluster = require('cluster');
  if(cluster.isWorker)
    console.log('Worker %d received request', cluster.worker.id);
  next();
});

app.get('/', function(req, res) {
  res.type('text/plain');
  res.send('Hello World');
});

app.use(function(req, res){
  res.status(400);
  res.type('text/plain');
  res.send('404 Error');
});

app.use(function(err, req, res, next){
  res.status(500);
  console.log(err.stack);
  res.type('text/plain');
  res.send('500 Error');
});

function startServer() {
  http.createServer(app).listen(app.get('port'), function() {
    console.log("Express started on http://localhost:" + app.get('port') +
     " Environment: " + app.get('env') + " press Ctrl-c to terminate");
  });
}

if(require.main === module) {
  // application run directly; start app server
  startServer();
} else {
   // application imported as a module via "require": export function to create server
  module.exports = startServer;
}

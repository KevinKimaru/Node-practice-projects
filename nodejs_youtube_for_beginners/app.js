var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var urlEncodedParser = bodyParser.urlencoded({extended: false});

app.set('view engine', 'ejs');
app.use('/assets', express.static('myAssets'));

//###############################
app.get('/', function(req, res) {
  res.send('This is the home page');
});

app.get('/contact', function(req, res) {
  res.send('This is the contact page');
});

app.get('/profile/:name', function(req, res) {
  res.send('This is the profile of ' + req.params.name);
});
//####################################


//###############################
app.get('/home', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/home/contact', function(req, res) {
  res.sendFile(__dirname + '/contact.html');
});
//#######################################


//##############################
app.get('/home/profile/:name', function(req, res) {
  var data = {age: 19, job: 'programmer', hobbies: ['playing', 'gaming', 'racing']};
  res.render('profile', {person: req.params.name, data: data});
});

app.get('/home2', function(req, res) {
  res.render('index');
});

app.get('/home2/contact', function(req, res) {
  res.render('contact', {qs: req.query});
});

app.post('/contact',urlEncodedParser, function(req, res) {
  console.log(req.body);
  res.render('contact-success', {data: req.body});
});
//##############################

app.listen(3000);

var https = require('https');
var http = require('http');
var mongoose = require('mongoose');
var credentials = require('./lib/credentials.js');

//setup express
var express = require('express');
var app = express();

//setup handlebars
var handlebars = require('express3-handlebars').create({
  defaultLayout: 'main',
  helpers: {
    section: function(name, options) {
      if(!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//setup port
app.set('port', process.env.PORT || 3000);

//setup body-parsers
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//setup statics
app.use(express.static(__dirname + '/public'));

// setup mongoose
switch (app.get('env')) {
  case 'production':
    mongoose.connect(credentials.mongo.production.connectionString);
    break;
  case 'development':
    mongoose.connect(credentials.mongo.development.connectionString);
    break;

}

//setup session
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var sessConfig = {
  secret: credentials.session.secret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000000
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
};
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sessConfig.cookie.secure = true // serve secure cookies
}
app.use(session(sessConfig));

//setup flash messages
app.use(function(req, res, next) {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

//setup csurf
app.use(require('csurf')());


//Handle Routes
var routes = require('./routes.js')(app);


//start server
var server = http.createServer(app);

//setup sockets
var io = require('socket.io')(server);
require('./mysocket.js')(io);


server.listen(app.get('port'), function() {
  console.log("Express started on http://localhost:" + app.get('port') + " Environment: "
  + app.get('env') + " press Ctrl-c to terminate");
});

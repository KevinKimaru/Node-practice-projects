var https = require('https');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var credentials = require('./lib/credentials.js');
var Vacation = require('./models/vacation.js');
var weather = require('./lib/weather.js');
var fs = require('fs');

var opts = {
  server: {
    socketOptions: {keepAlive: 1}
  }
};

switch(app.get('env')) {
  case 'development':
    app.use(require('morgan')('dev'));
    mongoose.connect(credentials.mongo.development.connectionString, opts);
    break;
  case 'production':
    app.use(require('express-logger')({
      path: __dirname + '/log/requests.log'
    }));
    mongoose.connect(credentials.mongo.production.connectionString, opts);
    break;
}

Vacation.find(function(err, vacations){
    if(vacations.length) return;
    new Vacation({
      name: 'Hood River Day Trip',
      slug: 'hood-river-day-trip',
      category: 'Day Trip',
      sku: 'HR199',
      description: 'Spend a day sailing on the Columbia and ' +
      'enjoying craft beers in Hood River!',
      priceInCents: 9995,
      tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
      inSeason: true,
      maximumGuests: 16,
      available: true,
      packagesSold: 0,
    }).save();
    new Vacation({
      name: 'Oregon Coast Getaway',
      slug: 'oregon-coast-getaway',
      category: 'Weekend Getaway',
      sku: 'OC39',
      description: 'Enjoy the ocean air and quaint coastal towns!',
      priceInCents: 269995,
      tags: ['weekend getaway', 'oregon coast', 'beachcombing'],
      inSeason: false,
      maximumGuests: 8,
      available: true,
      packagesSold: 0,
    }).save();
    new Vacation({
      name: 'Rock Climbing in Bend',
      slug: 'rock-climbing-in-bend',
      category: 'Adventure',
      sku: 'B99',
      description: 'Experience the thrill of climbing in the high desert.',
      priceInCents: 289995,
      tags: ['weekend getaway', 'bend', 'high desert', 'rock climbing'],
      inSeason: true,
      requiresWaiver: true,
      maximumGuests: 4,
      available: false,
      packagesSold: 0,
      notes: 'The tour guide is currently recovering from a skiing accident.',
    }).save();
});


var handlebars = require('express3-handlebars').create({
  defaultLayout:'main',
  helpers: {
    section: function(name, options){
      if(!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars')

app.set('port', process.env.PORT || 3000);

app.use(require('body-parser')());

// app.use(require('cookie-parser')(credentials.cookieSecret));
// app.use(require('express-session')());
app.use(require('express-session')({
  secret: credentials.cookieSecret,
  store: require('mongoose-session')(mongoose)
}));

app.use(require('csurf')());

app.use(function(req, res, next) {
  res.locals._csrfToken = req.csrfToken();
  next();
});

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
  res.locals.showTests = app.get('env') === 'production' && req.query.test === '1';
  next();
});

app.use(function(req, res, next) {
  if(!res.locals.partials) res.locals.partials = {};
  res.locals.partials.weather = weather.getWeatherData();
  next();
});

app.use(function(req, res, next){
  // if there's a flash message, transfer
  // it to the context, then clear it
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

require('./routes.js')(app);

var options = {
  key: fs.readFileSync(__dirname + '/ssl/elowing.pem'),
  cert: fs.readFileSync(__dirname + '/ssl/elowing.crt')
};

https.createServer(options, app).listen(app.get('port'), function() {
  console.log("Express started on http://localhost:" + app.get('port') + " Environment: "
  + app.get('env') + " press Ctrl-c to terminate");
});

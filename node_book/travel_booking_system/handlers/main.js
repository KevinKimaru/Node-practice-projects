var fortunes = require('../lib/fortunes.js');
var weather = require('../lib/weather.js');
var formidable = require('formidable');
var credentials = require('../lib/credentials');
var nodemailer = require('nodemailer');
var fs = require('fs');
// var emailService = require('./lib/email.js')(credentials);
var mongoose = require('mongoose');
var Vacation = require('../models/vacation.js');
var VacationInSeasonListener = require('../models/vacationInSeasonListener.js');

exports.home = function(req, res) {
  res.render('home');
};

exports.error = function(req, res) {
  res.render('500');
};

exports.cartCheckoutGet = function(req, res) {
  res.render('cart-checkout');
};

exports.cartCheckoutPost = function(req, res) {
  // var cart = req.session.cart;
  // if(!cart) next(new Error('Cart does not exist'));
  var cart = {};
  var name = req.body.name || '', email = req.body.email || '';
  // assign a random cart ID; normally we would use a database ID here
  cart.number = Math.random().toString().replace(/^0\.0*/, '');
  cart.billing = {
    name: name,
    email: email
  };
  res.render('email/cart-thank-you',
    {layout: null, cart: cart},
    function(err, html) {
      if(err) console.log('error in html template');
      emailService.send(cart.billing.email, 'Thankyou for booking your trip with Elowing', html);
    }
  );
  res.render('cart-thank-you', {cart: cart});
};

exports.contestVacationPhotoGet = function(req, res) {
  var now = new Date();
  res.render('contest/vacation-photo', {year: now.getFullYear(), month: now.getMonth()});
};

//make sure data directory exists
var dataDir = __dirname + '/data';
var vacationPhotoDir = dataDir + '/vacation-photo';
fs.existsSync(dataDir) || fs.mkdirSync(dataDir);
fs.existsSync(vacationPhotoDir) || fs.mkdirSync(vacationPhotoDir);

function saveContestEntry(contestName, email, year, month, photoPath){
  // TODO...this will come later
}

exports.contestVacationPhotoPost = function(req, res) {
  var form = new formidable.IncomingForm({
    uploadDir: __dirname + '/data',
    keepExtensions: true,
  });
  form.parse(req, function(err, fields, files) {
    if(err) return res.redirect(303, '/error');
    if(err) {
      res.session.flash = {
        type: 'danger',
        intro: 'oops!',
        message: 'There was an error processing your request. Please try again.',
      };
      return res.redirect(303, '/contest/vacation-photo');
    }
    var photo = files.photo;
    var dir = vacationPhotoDir + '/' + Date.now();
    var path = dir + '/' + photo.name;
    fs.mkdirSync(dir);
    fs.renameSync(photo.path,  dir + '/' + photo.name);
    saveContestEntry('vacation-photo', fields.email, req.params.year, req.params.month, path);
     req.session.flash = {
       type: 'success',
       intro: 'Good luck!',
       message: 'You have been entered into the contest.',
     };
    res.redirect(303, '/contest/vacation-photo/entries');
  });
};

exports.newsletter = function(req, res) {
  res.render('newsletter', {csrf: 'CSRF token here'});
};

exports.process = function(req, res) {
  var myFlash = {
    type: 'danger',
    intro: 'Validation error!',
    message: 'You have been successfully signed up for the newsletters.',
  };
   if(req.xhr || req.accepts('json,html')==='json') {
     res.locals.flash = myFlash;
     res.send({success: true});
   } else {
     req.session.flash = myFlash;
     res.redirect(303, '/thankyou');
   }
};

exports.thankyou = function(req, res){
  res.render('thankyou');
};

exports.headers = function(req, res) {
  console.log(req.headers);
  res.set('Content-Type', 'text/plain');
  var headersString = '';
  for(var name in req.headers) headersString += name + ': ' + req.headers[name] + '\n';
  res.send(headersString);
};

exports.about = function(req, res) {
  res.render('about', {fortune: fortunes.getFortune()});
};

exports.vacations = function(req, res){
  Vacation.find({ available: true }, function(err, vacations){
     var currency = req.session.currency || 'USD';
    var context = {
      currency: currency,
      vacations: vacations.map(function(vacation){
       return {
         sku: vacation.sku,
         name: vacation.name,
         description: vacation.description,
         // price: vacation.getDisplayPrice(),
         price: convertFromUSD(vacation.priceInCents/100, currency),
         inSeason: vacation.inSeason,
         qty: vacation.qty
       }
     })
   };
    switch(currency){
      case 'USD': context.currencyUSD = 'selected'; break;
      case 'GBP': context.currencyGBP = 'selected'; break;
      case 'BTC': context.currencyBTC = 'selected'; break;
    }
   res.render('vacations', context);
 });
};

exports.notifyInSeasonGet = function(req, res){
  res.render('notify-me-when-in-season', { sku: req.query.sku });
};

exports.notifyInSeasonPost = function(req, res){
  VacationInSeasonListener.update(
    { email: req.body.email },
    { $push: { skus: req.body.sku } },
    { upsert: true },
    function(err){
      if(err) {
        console.error(err.stack);
        req.session.flash = {
          type: 'danger',
          intro: 'Ooops!',
          message: 'There was an error processing your request.',
        };
        return res.redirect(303, '/vacations');
      }
      req.session.flash = {
        type: 'success',
        intro: 'Thank you!',
        message: 'You will be notified when this vacation is in season.',
      };
      return res.redirect(303, '/vacations');
    }
  );
};

exports.setCurrency = function(req,res) {
 req.session.currency = req.params.currency;
 return res.redirect(303, '/vacations');
};

function convertFromUSD(value, currency){
  switch(currency){
    case 'USD': return value * 1;
    case 'GBP': return value * 0.6;
    case 'BTC': return value * 0.0023707918444761;
    default: return NaN;
  }
}

//API
var Attraction = require('../models/attraction.js');
exports.getAttractionsApi = function(req, res){
  Attraction.find({ approved: true }, function(err, attractions){
    if(err) return res.send(500, 'Error occurred: database error.');
    res.json(attractions.map(function(a){
      return {
        name: a.name,
        id: a._id,
        description: a.description,
        location: a.location,
      }
    }));
  });
};
exports.addAttractionsApi = function(req, res){
  var a = new Attraction({
    name: req.body.name,
    description: req.body.description,
    location: { lat: req.body.lat, lng: req.body.lng },
    history: {
      event: 'created',
      email: req.body.email,
      date: new Date(),
    },
    approved: false,
  });
  a.save(function(err, a){
    if(err) return res.send(500, 'Error occurred: database error.');
    res.json({ id: a._id });
  });
};
exports.getIdAttractionApi = function(req,res){
  Attraction.findById(req.params.id, function(err, a){
    if(err) return res.send(500, 'Error occurred: database error.');
    res.json({
      name: a.name,
      id: a._id,
      description: a.description,
      location: a.location,
    });
  });
};


exports.err404 = function(req, res){
  res.status(400);
  res.render('404');
};

exports.err500 = function(err, req, res, next){
  res.status(500);
  console.log(err.stack);
  res.render('500');
};

var mongoose = require('mongoose'),    Schema = mongoose.Schema;

mongoose.connect('mongodb://127.0.0.1:27017/mongoosetest');
mongoose.connection.on('open', function() {
   console.log('Mongoose connected.');
});

var Account = new Schema({
   username: { type: String, required: true },
   date_created: { type: Date, default: Date.now },
   visits: { type: Number, default: 0 },
   active: { type: Boolean, default: false },
   age: {type: Number, required: true, min: 18, max: 70}
 });

 Account.statics.findByAgeRange = function(min, max, callback){
   this.find({age: {$gt: min, $lte: max}}, callback);
 };

 Account.virtual('username_visits')
  .get(function() {
    return this.username + ' - ' + this.visits;
  })
  .set(function(username_visits) {
    var parts = username_visits.split(' - ');
    this.username = parts[0];
    this.visits = parts[1];
  });

var AccountModel = mongoose.model('AccountMd', Account);
var newUser = new AccountModel({username: 'Neema', age: 40});
// newUser.save();

console.log("username: " + newUser.username);
console.log("Date created: " + newUser.date_created);
console.log("Visits: " + newUser.visits);
console.log("Active: " + newUser.active);

AccountModel.findByAgeRange(15, 100, function(err, accounts) {
  console.log('This age bracket accounts ' + accounts.length);
});

AccountModel.findOne({username: 'Neema'}, function(err, account) {
  if(err) {
    console.log("Error: " + err.message);
    throw err;
  }
  if(account) {
    account.visits = account.visits + 1;
    account.save(function(err, account) {
      if (err) {
        console.log('Error saving updating account: ' + err);
        throw err;
      }
    });
    console.log("Incremented visits");
  }
});

AccountModel.find({username: 'Kevin'}, function(err, accounts) {
  console.log('Kevins Accounts: ' + accounts.length);
  console.log("User visits: " + accounts[0].username_visits);
  // accounts[0].remove(function(err) {
  //   if(err) {
  //     throw err;
  //   }
  // });
});

// mongoose.connection.close();

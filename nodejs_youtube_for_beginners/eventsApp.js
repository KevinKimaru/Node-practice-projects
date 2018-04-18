var events = require('events');
var util = require('util');

var myEmitter = new events.EventEmitter();

myEmitter.on('someEvent', function(mssg) {
  console.log(mssg);
});

myEmitter.emit('someEvent', 'The event was emitted');


var Person = function(name) {
  this.name = name;
};
util.inherits(Person, events.EventEmitter);

var kevin = new Person('Kevin');
var eric = new Person('Eric');
var liz = new Person('Liz');
var ryne = new Person('Ryne');
var people = [kevin, eric, liz, ryne];
people.forEach(function(person) {
  person.on('speak', function(mssg) {
    console.log(person.name + ' said ' + mssg);
  });
});
eric.emit('speak', "Hello my people!");

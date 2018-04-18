//Intro to modules
var stuff = require('./stuff');
//Intro to modules

//both in window object and global object
console.log("Hello world");

setTimeout(function() {
  console.log("3 seconds have passed");
}, 3000);

var time = 0;
var timer = setInterval(function() {
  time += 2;
  console.log(time + " seconds have passed");
  if (time > 5) {
    clearInterval(timer);
  }
}, 2000);

console.log(__dirname);
console.log(__filename);
//both in window object and global object

//intro to modules
console.log(stuff.counter(['Kevin', 'Kimaru', 'Chege']));
console.log(stuff.adder(2, 3));
console.log(stuff.adder(stuff.pi, 3));
console.log(stuff.subtracter(7, 3));
//Intro to modules

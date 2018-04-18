var counter = function(arr) {
  return "There are " + arr.length + " elements in this array";
}

module.exports.subtracter = function(a, b) {
    return `The difference of the two numbers is ${a - b}`;
}

var adder = function(a, b) {
  return `The sum of the two numbers is ${a + b}`;
}

var pi = 3.142;

//You can use this method or the one next
module.exports.counter = counter;
module.exports.adder = adder;
module.exports.pi = pi;

//Or this one..Note you have to declare subtracter for it to work
// module.exports = {
//   counter: counter,
//   adder: adder,
//   subtracter: subtracter,
//   pi: pi
// };

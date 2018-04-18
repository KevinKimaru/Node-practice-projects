var fs = require('fs');

//synchronous
var readMe = fs.readFileSync('readMe.txt', 'utf8');
fs.writeFileSync('writeMe.txt', readMe);
console.log(readMe);

//deleting
fs.unlink('writeMe.txt');

//asynchronous
fs.readFile('readMe.txt', 'utf8', function(err, data) {
  fs.writeFile('writeMe.txt', data);
  console.log(data);
});

// directory
fs.mkdirSync('myDir'); //make
fs.rmdirSync('myDir'); //remove

//asynchronous making and reoving directories
  fs.mkdir('stuff', function() {
    fs.readFile('readMe.txt', 'utf8', function(err, data) {
      fs.writeFile('./stuff/writeMe.txt', data);
    });
  });

fs.unlink('./stuff/writeMe.txt', function() {
  fs.rmdir('stuff');
});

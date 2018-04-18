var fs = require('fs');

var myReadStream = fs.createReadStream(__dirname + '/readMe2.txt', 'utf8');
var myWriteStream = fs.createWriteStream(__dirname + '/writeMe2.txt');
var myWriteStream = fs.createWriteStream(__dirname + '/writeMe3.txt');

//using event to write to a  write stream from a read stream
myReadStream.on('data', function(chunk) {
  console.log('Chunk received: ');
  myWriteStream.write(chunk);
});

//using pipes to write to a  write stream from a read stream
myReadStream.pipe(myWriteStream);

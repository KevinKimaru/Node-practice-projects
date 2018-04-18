const fork = require('child_process').fork;
// fork('child.js');
// fork('child.js');
// fork('child.js');
// fork('child.js');
// fork('child.js');
const child = fork('child.js');

child.on('message', (msg) => {
    console.log(msg);
});
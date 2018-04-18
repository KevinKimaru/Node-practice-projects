const os = require('os');
const spawn = require('child_process').spawn;

const ls = spawn('ls', ['-la', os.homedir()]);

ls.stdout.pipe(process.stdout);

ls.on('close', (code) => {
    console.log('Process exited with code ', code);
});
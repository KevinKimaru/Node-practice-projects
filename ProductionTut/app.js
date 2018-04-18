const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(__dirname + '/public'));

const debug = require('debug')('app');
const winston = require('winston');

const nconf = require('nconf');
nconf.argv().env().file(__dirname + '/app.json');

const port = nconf.get('api:port');
debug(port);

debug('about to add file');
winston.add(winston.transports.File, {
    filename: 'app.log'
});

debug('about to route at /');
app.get('/', (req, res) => {
    res.send('index.html');
});

debug('about to make connection to socket');
io.on('connection', (sock) => {
    // console.log('Somebody connected');
    winston.info('Somebody connected');
    sock.emit('msg', 'Hi there.');
    sock.on('msg', text => {
        io.emit('msg', text);
    });
});


server.listen(port, () => {
    winston.info('App started. Listening on port 8080');
});
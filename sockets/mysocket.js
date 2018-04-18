module.exports = function(io) {
  io.on('connection', function(socket) {
    console.log('A client is connected!');
    socket.emit('message', 'You are connected!');
    // socket.emit('message', { content: 'You are connected!', importance: 1 });
    socket.broadcast.emit('message', 'Another client has just connected');

    socket.on('message', function(message) {
      console.log('Hey server a client is speaking to you. They are saying ' + message );
    });
  });
};

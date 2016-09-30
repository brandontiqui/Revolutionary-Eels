var io = require('../../server');

/*
todo: import into server.js
*/

module.exports = function() {
io.on('connection', function(socket) {
	// need to handle when user first connects

  console.log('a user connected');

	socket.on('change', function(msg) {
		console.log('text:' + msg)
		io.emit('change', msg);
	})
  socket.on('disconnect', function() {
    console.log('a user disconnected');
  });
});

};
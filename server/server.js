require('dotenv').config();

var express = require('express');
var app = express();

var http = require('http').Server(app);

var io = require('socket.io')(http);

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

var morgan = require('morgan');
var bodyParser = require('body-parser');
var documentRouter = require('./resources/routers/documentRouter');
var usersRouter = require('./resources/routers/usersRouter');
var commentsRouter = require('./resources/routers/commentsRouter');
var db = require('../db/config.js');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/../client'));

app.get('/', function(req, res) {
  res.sendFile('index');
});

app.use('/document', documentRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);

var port = process.env.PORT || 8000;
http.listen(port);
console.log('Server running on port ' + port);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { ExpressPeerServer } = require('peer')
const app = express();
const SocketServer = require('./socketApp')
const con_url = process.env.MONGODB_URL;
const path=require('path');
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const http = require('http').createServer(app)
const io = require('socket.io')(http);
io.on('connection', socket => {
	SocketServer(socket)
})
ExpressPeerServer( http, {path: '/'} )
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
	res.header('access-control-expose-headers', 'Set-Cookie')
	next();
  });
app.use('/api', require('./routes/auth'))
app.use('/api', require('./routes/user'))
app.use('/api', require('./routes/post'))
app.use('/api', require('./routes/comment'))
app.use('/api', require('./routes/notify'))
app.use('/api', require('./routes/msg'))
mongoose.connect(con_url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,

}, (err) => {
	if (err) throw err;
	console.log("Connected to mongo successfully");
});

http.listen(port, () => { console.log(`Listening to ${port}`) });
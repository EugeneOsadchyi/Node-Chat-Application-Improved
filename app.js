require('./config/config');
require('./config/mongoose');

const logger = require('./config/logger');

const path = require('path');

const express = require('express');
const expressFlash = require('express-flash-2');
const expressLayouts = require('express-ejs-layouts');
const expressSession = require('express-session')({
  secret: process.env.SECRET_KEY,
  resave: true,
  saveUninitialized: true,
});

const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const siofu = require('socketio-file-upload');
const sharedSession = require('express-socket.io-session');

const app = express();
const server = require('http').createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Starting server on http://localhost:${port}`);
});

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

// Configure express layouts
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.use(expressLayouts);

app.use(expressSession);

app.use(expressFlash());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Load routing
app.use(require('./app/routes'));


// Sockets

// socketio-file-upload
app.use(siofu.router);

io.of('/chat').use(sharedSession(expressSession, {
  autoSave: true,
}));
require('./app/sockets/chat')(io);

const SocketIOFileUpload = require('socketio-file-upload');
const logger = require('../../config/logger');

const Room = require('../models/room');

const { isRealString } = require('../helpers/validation');
const { generateMessage } = require('../helpers/message');
const Users = require('../helpers/users');

const users = new Users();

const chat = (io) => {
  const nsp = io.of('/chat');

  nsp.on('connection', (socket) => {
    socket.roomId = socket.handshake.session.roomId;
    socket.currentUser =  socket.handshake.session.currentUser || {};

    initializeFileUpload(socket);

    socket.on('join', (callback) => {
      if (!socket.roomId || Object.keys(socket.currentUser).length === 0) {
        callback('Room or user is not found. Please re-login');
      }
      const roomId = socket.roomId;

      socket.join(roomId);

      users.removeUser(socket.id);
      users.addUser(socket.id, socket.currentUser.name, socket.roomId);

      nsp.in(roomId).emit('updateUserList', users.getUserList(roomId));
      socket.to(roomId).emit('user joined', {
        name: socket.currentUser.name
      });

      Room.findOne({ _id: roomId }).populate('messages.user', 'name').then((room) => {
        if (room) {
          const messages = room.messages.map(message => {
            const msg = message.toObject();
            msg.from = msg.user.name;
            delete msg.user;
            return msg;
          });
          nsp.in(roomId).emit('updateMessages', messages);
        }
      });

      callback();
    });

    socket.on('disconnect', () => {
      const user = users.removeUser(socket.id);

      if (user) {
        socket.to(user.roomId).emit('updateUserList', users.getUserList(user.roomId));
        socket.to(user.roomId).emit('user left', { name: user.name });
      }
    });

    socket.on('createMessage', (message, callback) => {
      if (isRealString(message.text)) {
        const roomId = socket.roomId;

        Room.findOne({ _id: roomId }).then((room) => {
          if (!room) {
            callback('Room not found');
          }

          const msg = generateMessage(socket.currentUser.name, message.text);

          room.messages.push({ ...msg, user: socket.currentUser._id });

          room.save().then(() => {
            nsp.to(roomId).emit('newMessage', msg);
          }).catch((err) => {
            callback(`Error: ${err.message}`);
          });
        });
      }
    });
  });
};

function initializeFileUpload(socket) {
  const uploader = new SocketIOFileUpload();

  uploader.dir = process.env.UPLOAD_DIR;
  uploader.maxFileSize = process.env.UPLOAD_MAX_FILE_SIZE;

  uploader.on('saved', (event) => {
    Room.findOne({ _id: socket.roomId }).then((room) => {
      const file = {
        name: event.file.name,
        path: event.file.pathName
      };
      const msg = generateMessage(socket.currentUser.name, null, file);

      room.messages.push({ ...msg, user: socket.currentUser._id });

      room.save().then(() => {
        nsp.to(socket.roomId).emit('newMessage', msg);
      }).catch((err) => console.log(err));
    });

    logger.log('info', `Saved file: ${event.file.pathName}`);
  });

  uploader.on('error', (data) => {
    logger.log('error', data.error.toString());
  });

  uploader.listen(socket);
}

module.exports = chat;

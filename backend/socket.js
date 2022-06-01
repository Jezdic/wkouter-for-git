const app = require('./app');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

let onlineUsers = [];

const addUser = (username, socketId) => {
  if (!onlineUsers.some(user => user.username === username))
    onlineUsers.push({ username, socketId });
};

const removeUser = socketId =>
  (onlineUsers = onlineUsers.filter(user => user.socketId !== socketId));

const getUser = username =>
  onlineUsers.find(user => user.username === username);

notifyUser = notification => {
  // get notification object, check if the notified
  //username is online, socket.emit(notification)
  //if not, return
  console.log(notification);
  const notifiedUser = getUser(notification.notifiedUsername);

  if (!notifiedUser) return;

  io.to(notifiedUser.socketId).emit('RECEIVE_NOTIFICATION', notification);
};

io.on('connection', socket => {
  console.log(`connection: ${socket.id}`);

  socket.on('LOGIN_SUCCESS', username => {
    addUser(username, socket.id);
    console.log(onlineUsers);
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
  });
});

module.exports = server;

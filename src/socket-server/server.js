const express = require('express');
const app = express();
// const path = require('path');
const port = process.env.port || 3000;

// app.use(express.static(__dirname + '/dist/one-day-chat-app'))

// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname));
// });

const httpServer = require('http').createServer(app);

var io = require('socket.io')(httpServer, {
  cors: {origin : '*'}
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (channelId, message, userId) => {
    io.emit('message', `${channelId}`, `${message}`, `${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected.');
  });
});

httpServer.listen(port, () => {
  console.log(`listening on port ${port}`);
});


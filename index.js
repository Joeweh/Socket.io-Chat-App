const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000

const sockets = []

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  sockets.push(socket.id)
  
  socket.on('message', (data) => {
    socket.broadcast.emit("sendMessage", data)
  })

  socket.on('disconnect', () => {
    sockets.splice(sockets.indexOf(socket.id), 1)
  })
});

server.listen(port, () => {
  console.log('listening on *:3000');
});
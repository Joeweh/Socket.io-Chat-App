const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  console.log("connected")
  socket.on('message', (data) => {
    socket.broadcast.emit("sendMessage", data)
  })
});

server.listen(port, () => {
  console.log('listening on *:3000');
});
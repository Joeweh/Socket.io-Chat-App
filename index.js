const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000

let users = []

app.use(express.static('public'))
app.use(express.static('public/chat'))
app.use(express.static('public/setup'))
app.use(express.static('public/utils'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/setup/index.html')
});

io.on('connection', socket => {
  socket.on("join server", (username) => {
    users.push({
      id: socket.id,
      username: username 
    })
  })
  // broadcast data to specific room
  // socket.to('some room').emit('some event')
  socket.on("join room", (room) => {
    socket.join(room.name)
    
  })
  
  socket.on('message', (data) => {
    io.emit("sendMessage", data)
  })

  socket.on('disconnect', () => {
    users = users.filter(u => u.id !== socket.id)
  })
});

server.listen(port, () => {
  console.log('listening on *:3000')
});
let userScript = require("./utils/users.js")

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
  socket.on("join", (username, room) => {
    let user = userScript.userJoin(socket.id, username, room)

    socket.join(user.room)

    socket.emit("load users", userScript.getRoomUsers(user.room))

    socket.to(user.room).emit("add user", user)
  })
  
  socket.on('send message', (message) => {
    const user = userScript.getCurrentUser(socket.id);

    socket.to(user.room).emit("recieve message", message)
  })

  socket.on('disconnect', () => {
    const user = userScript.userLeave(socket.id);

    if (user) 
    {
      socket.to(user.room).emit("remove user", userScript.getRoomUsers(user.room))
    }
  })
});

server.listen(port, () => {
  console.log('listening on *:3000')
});
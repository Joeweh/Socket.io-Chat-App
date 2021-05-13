let userScript = require("./utils/users.js")
let messageScript = require("./utils/message.js")

const moment = require('moment')
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000

let rooms = []

app.use(express.static('public/chat'))
app.use(express.static('public/setup'))
app.use(express.static('public/utils'))
app.use(express.static('public/join-room'))
app.use(express.static('public/create-room'))
app.use(express.static('public/login'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login/login.html')
});

io.on('connection', socket => {
  socket.on("join", (username, room) => {
    let user = userScript.userJoin(socket.id, username, room)

    if (rooms.findIndex(room => room === user.room) === -1)
    {
      rooms.push(room)
      io.emit("add room", room)
    }

    socket.join(user.room)

    socket.emit("load users", userScript.getRoomUsers(user.room))

    socket.to(user.room).emit("add user", user)

    socket.to(user.room).emit("send message", "Server", username + " has joined the room")
  })
  
  socket.on('send message', (author, content) => {
    io.to(userScript.getCurrentUser(socket.id).room).emit("recieve message", messageScript.formatMessage(author, content))
  })

  socket.on('disconnect', () => {
    const user = userScript.userLeave(socket.id);

    if (user) 
    {
      socket.leave(user.room)

      if (userScript.getRoomUsers(user.room).length <= 0)
      {
        rooms = rooms.filter(room => room !== user.room);

        io.emit("remove room", rooms)
      }

      socket.to(user.room).emit("remove user", userScript.getRoomUsers(user.room))
      socket.to(user.room).emit("send message", "Server", user.username + " has left the room")
    }
  })
});

server.listen(port, () => {
  console.log('listening on *:3000')
});
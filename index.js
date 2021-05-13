let userScript = require("./utils/users.js")
let messageScript = require("./utils/message.js")
let roomScript = require("./utils/rooms.js")

const moment = require('moment')
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000

app.use(express.static('public/chat'))
app.use(express.static('public/setup'))
app.use(express.static('public/utils'))
app.use(express.static('public/join-room'))
app.use(express.static('public/create-room'))
app.use(express.static('public/login'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login/login.html')
});

const chatNamespace = io.of('/chat')

io.on('connection', socket => {
  socket.on("join", () => {
    socket.emit("load rooms", roomScript.getRooms())
  })
})


chatNamespace.on('connection', socket => {
  socket.on("join", (username, room) => {
    let user = userScript.userJoin(socket.id, username, room)

    if (!roomScript.isOpen(room))
    {
      roomScript.createRoom(room)
      socket.broadcast.emit("add room", room)
      io.emit("add room", room)
      console.log("added")
    }

    socket.emit("load rooms", roomScript.getRooms())

    socket.join(user.room)

    socket.emit("load users", userScript.getRoomUsers(user.room))

    socket.to(user.room).emit("add user", user)

    socket.to(user.room).emit("send message", "Server", username + " has joined the room")
  })
  
  socket.on('send message', (author, content) => {
    chatNamespace.to(userScript.getCurrentUser(socket.id).room).emit("recieve message", messageScript.formatMessage(author, content))
  })

  socket.on('disconnect', () => {
    const user = userScript.userLeave(socket.id);

    if (user) 
    {
      socket.leave(user.room)

      if (userScript.getRoomUsers().length <= 0)
      {
        roomScript.destroyRoom(user.room)

        chatNamespace.emit("remove room", roomScript.getRooms())
        io.emit("remove room", roomScript.getRooms())
        console.log("deleted")
      }

      socket.to(user.room).emit("remove user", userScript.getRoomUsers(user.room))
      socket.to(user.room).emit("send message", "Server", user.username + " has left the room")
    }
  })
});

server.listen(port, () => {
  console.log('listening on *:3000')
});
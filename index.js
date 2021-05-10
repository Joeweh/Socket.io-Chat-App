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

const chatNamespace = io.of("/chat")

let rooms = []

app.use(express.static('public'))
app.use(express.static('public/chat'))
app.use(express.static('public/setup'))
app.use(express.static('public/utils'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/setup/index.html')
});

io.on('connection', socket => {
  socket.emit("load rooms", rooms)
})

chatNamespace.on('connection', socket => {
  socket.on("join", (username, room) => {
    let user = userScript.userJoin(socket.id, username, room)

    if (rooms.findIndex(room => room === user.room) === -1)
    {
      console.log("true")
      rooms.push(room)
      io.of("/").emit("add room", room)
    }

    socket.join(user.room)

    socket.emit("load users", userScript.getRoomUsers(user.room))

    socket.to(user.room).emit("add user", user)
  })
  
  socket.on('send message', (author, content) => {
    chatNamespace.to(userScript.getCurrentUser(socket.id).room).emit("recieve message", messageScript.formatMessage(author, content))
  })

  socket.on('disconnect', () => {
    const user = userScript.userLeave(socket.id);

    if (user) 
    {
      socket.leave(user.room)

      if (userScript.getRoomUsers(user.room).length <= 0)
      {
        rooms = rooms.filter(room => room !== user.room);

        io.of("/").emit("remove room", rooms)
      }

      socket.to(user.room).emit("remove user", userScript.getRoomUsers(user.room))
    }
  })
});

server.listen(port, () => {
  console.log('listening on *:3000')
});
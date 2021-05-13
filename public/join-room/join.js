const fab = document.getElementById('FAB')
const roomField = document.getElementById('roomField')
const roomContainer = document.getElementById('roomContainer')

let socket = io.connect("/")

fab.addEventListener('click', () => {
  window.location.pathname = "/create.html"
})

function appendRoom(room)
{
  let button = document.createElement("BUTTON");
 
  button.innerHTML = room;

  button.addEventListener('click', () => {
    localStorage.setItem("room", button.innerHTML)
    window.location.pathname = "/chat.html"
  })

  button.classList.add("room")

  roomContainer.appendChild(button);
}

socket.on("load rooms", (rooms) => {
  for (i = 0; i < rooms.length; i++)
  {
    appendRoom(rooms[i])
  }
})

socket.on("add room", (room) => {
  appendRoom(room)
})

socket.on("remove room", (rooms) => {
  while (roomContainer.firstChild) 
  {
    roomContainer.removeChild(roomContainer.firstChild);
  }

  for (i = 0; i < rooms.length; i++)
  {
    appendRoom(rooms[i])
  }
})

document.getElementById('joinScript').addEventListener('load', () => {
  if (localStorage.getItem("username") === null)
  {
    window.location.pathname = '/login.html'
  }

  else if (localStorage.getItem("room") !== null)
  {
    window.location.pathname = "/chat.html"
  }
  socket.emit("join")
})

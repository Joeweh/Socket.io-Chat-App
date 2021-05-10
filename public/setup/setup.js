const nameField = document.getElementById('nameField')
const roomField = document.getElementById('roomField')
const chatButton = document.getElementById('chatButton')
const roomContainer = document.getElementById('roomContainer')

let socket = io.connect("/")

function appendRoom(room)
{
  let h3 = document.createElement('h3');
  
  h3.appendChild(document.createTextNode(room));

  h3.classList.add("room")
  
  roomContainer.appendChild(h3)
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

chatButton.addEventListener('click', () => {
  let name = nameField.value.trim()
  let room = roomField.value.trim()
  
  if (name !== "" && room !== "")
  {
    localStorage.setItem("username", name)
    localStorage.setItem("room", room)
    window.location.pathname = '/chat.html'
  }
})

document.getElementById('setupScript').addEventListener('load', () => {
  if (localStorage.getItem("username") !== null && localStorage.getItem("room") !== null)
  {
    window.location.pathname = '/chat.html'
  }
})
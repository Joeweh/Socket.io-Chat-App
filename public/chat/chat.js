const messageContainer = document.getElementById('messageContainer')
const messageField = document.getElementById('messageField')
const sendButton = document.getElementById('sendButton')
const leaveButton = document.getElementById('leaveButton')
const userList = document.getElementById('userList')

let socket = io.connect('/chat')

document.getElementById('chatScript').addEventListener('load', () => {
  if (localStorage.getItem("username") === null)
  {
    window.location.pathname = '/login.html'
  }

  else if (localStorage.getItem("room") === null)
  {
    window.location.pathname = '/join.html'
  }

  socket.emit("join", localStorage.getItem("username"), localStorage.getItem("room"))
})

sendButton.addEventListener('click', () => {
  if (messageField.value.trim() !== "")
  {    
    sendMessage(localStorage.getItem("username"), messageField.value.trim())

    updateUI()
  } 
})

leaveButton.addEventListener('click', () => {
  localStorage.removeItem("room")
  window.location.pathname = '/join.html'
})

document.addEventListener('keydown', event => {
  if (event.keyCode === 13 && messageField.value.trim() !== "")
  {
    sendMessage(localStorage.getItem("username"), messageField.value.trim())

    updateUI()
  }
})

function sendMessage(author, content)
{
  socket.emit('send message', author, content)
}

function appendMessage(message)
{
  let h2 = document.createElement('h2');
  
  h2.appendChild(document.createTextNode(message.timeStamp + " - " + message.author + ": " + message.body));
  
  h2.classList.add("message");

  messageContainer.appendChild(h2)
}

function appendUser(user)
{
  let h2 = document.createElement('h2');
  
  h2.appendChild(document.createTextNode(user.username));
  
  h2.classList.add("user");

  userList.appendChild(h2)
}

function formatUser(id, username, room)
{
  return {
    id: id,
    username: username,
    room: room
  }
}

function updateUI()
{
  messageField.value = ""

  messageField.focus()

  messageContainer.scrollTop = messageContainer.scrollHeight
}

socket.on('recieve message', (message) => {
  appendMessage(message)

  messageContainer.scrollTop = messageContainer.scrollHeight
})

socket.on("load users", (users) => {
  for (i = 0; i < users.length; i++)
  {
    appendUser(users[i])
  }
})

socket.on("remove user", (users) => {
  while (userList.firstChild) 
  {
    userList.removeChild(userList.firstChild);
  }

  for (i = 0; i < users.length; i++)
  {
    appendUser(users[i])
  }
})

socket.on("add user", (user) => {
  appendUser(user)
})
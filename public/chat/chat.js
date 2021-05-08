const messageContainer = document.getElementById('messageContainer')
const messageField = document.getElementById('messageField')
const sendButton = document.getElementById('sendButton')
const userList = document.getElementById('userList')

let socket = io.connect('/')

document.getElementById('chatScript').addEventListener('load', () => {
  if (localStorage.getItem("username") == null)
  {
    window.location.pathname = '/index.html'
  }

  socket.emit("join", localStorage.getItem("username"))
})

sendButton.addEventListener('click', () => {
  if (messageField.value.trim() !== "")
  {
    const message = formatMessage(localStorage.getItem("username"), messageField.value.trim(), getCurrentTime())

    appendMessage(message)
    
    sendMessage(message)

    updateUI()
  } 
})

document.addEventListener('keydown', event => {
  if (event.keyCode === 13 && messageField.value.trim() !== "")
  {
    const message = formatMessage(localStorage.getItem("username"), messageField.value.trim(), getCurrentTime())

    appendMessage(message)

    sendMessage(message)

    updateUI()
  }
})

function sendMessage(message)
{
  socket.emit('send message', message)
}

function formatMessage(author, content, timeStamp)
{
  return {
    author: author,
    body: content,
    timeStamp: timeStamp
  }
}

function appendMessage(message)
{
  let h2 = document.createElement('h2');
  
  h2.appendChild(document.createTextNode(message.timeStamp + " - " + message.author + ": " + message.body));
  
  h2.classList.add("message");

  messageContainer.appendChild(h2)
}

function getCurrentTime()
{
  time = ""
  date = new Date()

  time += date.getHours() > 12 ? date.getHours() - 12 + ":" : date.getHours() + ":" 

  time += date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()

  time += date.getHours() > 12 ? "pm" : "am"
  
  return time
}

function appendUser(user)
{
  let h2 = document.createElement('h2');
  
  h2.appendChild(document.createTextNode(user.username));
  
  h2.classList.add("user");

  userList.appendChild(h2)
}

function formatUser(id, username)
{
  return {
    id: id,
    username: username
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
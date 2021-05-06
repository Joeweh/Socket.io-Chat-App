const messageContainer = document.getElementById('messageContainer')
const messageField = document.getElementById('messageField')
const sendButton = document.getElementById('sendButton')
const userList = document.getElementById('userList')

var socket = io.connect('/')

sendButton.addEventListener('click', () => {
  if (messageField.value !== "")
  {
    let data = {
      author: localStorage.getItem("username"),
      body: messageField.value,
      timestamp: getCurrentTime()
    } 
    
    socket.emit('message', data)

    messageField.value = ""

    messageField.focus()
  } 
})

function getCurrentTime()
{
  date = new Date()
  time = ""

  if (date.getHours() > 12)
  {
    time += date.getHours() - 12 + ":"
  }

  else
  {
    time += date.getHours() + ":"
  }

  if (date.getMinutes() > 9)
  {
    time += date.getMinutes()
  }

  else
  {
    time += "0" + date.getMinutes()
  }

  return time;
}

socket.on('sendMessage', (data) => {
  var h2 = document.createElement('h2');
  
  h2.appendChild(document.createTextNode(data.timestamp + " - " + data.author + ": " + data.body));
  
  h2.classList.add("message");

  messageContainer.appendChild(h2)

  messageContainer.scrollTop = messageContainer.scrollHeight
})

document.addEventListener('keydown', event => {
  if (event.keyCode === 13 && messageField.value !== "")
  {
    let data = {
      author: localStorage.getItem("username"),
      body: messageField.value,
      timestamp: getCurrentTime()
    } 
  
    socket.emit('message', data)

    messageField.value = ""
  }
})

socket.on("update users", (users) => {
  while (userList.firstChild) 
  {
    userList.removeChild(userList.firstChild);
  }
  
  for (i = 0; i < users.length; i++)
  {
    var h2 = document.createElement('h2');
  
    h2.appendChild(document.createTextNode(users[i].username));
  
    h2.classList.add("user");

    userList.appendChild(h2)
  }
})

if (localStorage.getItem("username") == null)
{
  window.location.pathname = '/index.html'
}

socket.emit("join server", localStorage.getItem("username"))

messageField.focus()
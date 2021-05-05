const messageContainer = document.getElementById('messageContainer')
const messageField = document.getElementById('messageField')
const sendButton = document.getElementById('sendButton')

var socket = io.connect('/')

sendButton.addEventListener('click', () => {
  if (messageField.value !== "")
  {
    date = new Date()

    let data = {
      author: localStorage.getItem("username"),
      body: messageField.value,
      timestamp: date.getHours() > 12 ? `${date.getHours() - 12}:${date.getMinutes()}pm` : `${date.getHours()}:${date.getMinutes()}am`
    } 
    
    socket.emit('message', data)

    messageField.value = ""

    messageField.focus()
  } 
})

socket.on('sendMessage', (data) => {
  var h3 = document.createElement('h3');
  
  h3.appendChild(document.createTextNode(data.timestamp + " - " + data.author + ": " + data.body));
  
  h3.classList.add("message");

  messageContainer.appendChild(h3)

  messageContainer.scrollTop = messageContainer.scrollHeight
})

document.addEventListener('keydown', event => {
  if (event.keyCode === 13 && messageField.value !== "")
  {
    let timestamp = ""
    date = new Date()

    if (date.getHours() > 12)
    {
      timestamp = timestamp + date.getHours() - 12 + ":" + date.get
    }

    let data = {
      author: localStorage.getItem("username"),
      body: messageField.value,
      timestamp: date.getHours() > 12 ? `${date.getHours() - 12}:${date.getMinutes()}pm` : `${date.getHours()}:${date.getMinutes()}am`
    } 
  
    socket.emit('message', data)

    messageField.value = ""
  }
})

if (localStorage.getItem("username") == null)
{
  window.location.pathname = '/index.html'
}


socket.emit("join server", localStorage.getItem("username"))

messageField.focus()
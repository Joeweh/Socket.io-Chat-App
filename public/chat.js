const messageContainer = document.getElementById('messageContainer')
const messageField = document.getElementById('messageField')
const sendButton = document.getElementById('sendButton')

var socket = io.connect('/')

sendButton.addEventListener('click', () => {
  if (messageField.value !== "")
  {
    let data = {
      author: "",
      body: messageField.value,
      timestamp: ""
    } 

    sendMessage(data)

    messageField.value = ""
  } 
})

socket.on('sendMessage', (data) => {
  var h3 = document.createElement('h3');
  
  h3.appendChild(document.createTextNode("Inbound: " + data.body));
  
  messageContainer.appendChild(h3)
})

document.addEventListener('keydown', event => {
  if (event.keyCode === 13)
  {
    let data = {
      author: "",
      body: messageField.value,
      timestamp: ""
    } 
    
    sendMessage(data)

    messageField.value = ""
  }
})

function sendMessage(data)
{
  var h1 = document.createElement('h3');
  
  h1.appendChild(document.createTextNode("Outbound: " + data.body));
  
  messageContainer.appendChild(h1)

  socket.emit('message', data)
}
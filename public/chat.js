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

    var h1 = document.createElement('h3');
  
    h1.appendChild(document.createTextNode("Outcoming: " + data.body));
  
    messageContainer.appendChild(h1)

    socket.emit('message', data)

    messageField.value = ""
  } 
})

socket.on('sendMessage', (data) => {
  var h3 = document.createElement('h3');
  
  h3.appendChild(document.createTextNode("Incoming: " + data.body));
  
  messageContainer.appendChild(h3)
})
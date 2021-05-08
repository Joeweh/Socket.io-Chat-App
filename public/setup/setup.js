const nameField = document.getElementById('nameField')
const roomField = document.getElementById('roomField')
const chatButton = document.getElementById('chatButton')

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
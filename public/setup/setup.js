const nameField = document.getElementById('nameField')
const chatButton = document.getElementById('chatButton')

chatButton.addEventListener('click', () => {
  let name = nameField.value.trim()
  
  if (name !== "")
  {
    localStorage.setItem("username", name)
    window.location.pathname = '/chat.html'
  }
})

document.getElementById('setupScript').addEventListener('load', () => {
  if (localStorage.getItem("username") !== null)
  {
    window.location.pathname = '/chat.html'
  }
})
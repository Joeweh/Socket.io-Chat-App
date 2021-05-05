const nameField = document.getElementById('nameField')
const chatButton = document.getElementById('chatButton')

chatButton.addEventListener('click', () => {
  if (nameField.value !== "")
  {
    localStorage.setItem("username", nameField.value)
    window.location.pathname = '/chat.html'
  }
})

if (localStorage.getItem("username") !== null)
{
  window.location.pathname = '/chat.html'
}
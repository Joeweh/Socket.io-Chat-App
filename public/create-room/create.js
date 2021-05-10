const roomField = document.getElementById("roomField")
const createButton = document.getElementById("createButton")

createButton.addEventListener('click', () => {
  if (roomField.value.trim() !== "")
  {
    localStorage.setItem("room", roomField.value.trim())
    window.location.pathname = "/chat.html"
  }
})
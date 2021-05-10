const loginScript = document.getElementById("loginScript")
const nameField = document.getElementById("nameField")
const loginButton = document.getElementById("loginButton")

loginScript.addEventListener("load", () => {
  localStorage.removeItem("room")

  if (localStorage.getItem("username") !== null)
  {
    window.location.pathname = "/join.html"
  }
})

loginButton.addEventListener('click', () => {
  if (nameField.value.trim() !== "")
  {
    localStorage.setItem("username", nameField.value.trim())
    window.location.pathname = "/join.html"
  }
})
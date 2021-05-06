const nameField = document.getElementById('nameField')
const chatButton = document.getElementById('chatButton')

chatButton.addEventListener('click', () => {
  let name = cleanString(nameField.value)
  
  if (name !== "")
  {
    localStorage.setItem("username", name)
    window.location.pathname = '/chat.html'
  }
})

function cleanString(input) {
  let validInput = "";
  
  for (var i = 0; i < input.length; i++) 
  {
    if (input.charCodeAt(i) <= 127) 
    {
      validInput += input.charAt(i);
    }
  }
  return validInput;
}

if (localStorage.getItem("username") !== null)
{
  window.location.pathname = '/chat.html'
}
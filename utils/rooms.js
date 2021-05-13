let rooms = []

function isOpen(roomName)
{
  const index = rooms.findIndex((room) => room === roomName);

  if (index !== -1) 
  {
    return true
  }

  return false
}

function createRoom(room)
{
  rooms.push(room)

  return room
}

function destroyRoom(room)
{
  const index = rooms.findIndex(room => room === room);

  if (index !== -1) 
  {
    return rooms.splice(index, 1)[0];
  }
}

function getRooms()
{
  return rooms
}

module.exports = { createRoom, destroyRoom, getRooms, isOpen }
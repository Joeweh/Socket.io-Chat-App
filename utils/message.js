const moment = require("moment-timezone")

function formatMessage(author, content)
{
  return {
    author: author,
    body: content,
    timeStamp: moment.tz("America/New_York").format("LT")
  }
}

module.exports = {
  formatMessage
}
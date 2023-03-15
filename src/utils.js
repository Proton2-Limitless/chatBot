const formatMessage = (io, sessionId, message, data) => {
  let formatedMessage = []
  let errorMessage = {
    type: "bot",
    message
  }
  if (data.message[0] !== "") {
    formatedMessage.push(data)
  }
  formatedMessage.push(errorMessage)
  io.to(sessionId).emit('user-message', formatedMessage)
}
module.exports = formatMessage
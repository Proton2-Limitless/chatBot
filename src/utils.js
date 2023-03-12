const formatMessage = (io, sessionId, formatedMessage, message, data) => {
  let errorMessage = {
    type: "bot",
    message
  }
  if (data.message[0] !== "") {
    formatedMessage.push(data)
  }
  formatedMessage.push(errorMessage)
  io.to(sessionId).emit('message', formatedMessage)
}
module.exports = formatMessage
const { initialMessage } = require("./constCommands");
const name = (io, sessionId) => data => {
  if (data === "") return
  io.to(sessionId).emit("authorize", {
    name: data, auth: true, id: sessionId,
    message: {
      type: "bot",
      message: initialMessage
    }
  })
}

module.exports = {
  name
}
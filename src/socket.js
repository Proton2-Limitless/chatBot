const { message } = require("./utils/message");
const { name } = require("./utils/name");

function listen(io) {
  io.on("connection", (socket) => {
    const sessionId = socket.request.session.id
    socket.join(sessionId)
    socket.on("name", name(io, sessionId))
    //sends sessionId to user to validate user after a day
    io.to(sessionId).emit('sessionExpire', sessionId)
    let orderFlag = false
    let order = []
    let orderHistory = {
      [sessionId]: []
    }
    //this handle message sent back to user 
    socket.on("message", message(io, sessionId, orderFlag, orderHistory, order))
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });
  });
}

module.exports = listen

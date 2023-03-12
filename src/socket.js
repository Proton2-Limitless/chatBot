const formatMessage = require("./utils");

function listen(io, seedOrder) {
  io.on("connection", (socket) => {
    console.log(`connected to socket succesfully, ${socket.id}`);
    const commands = [
      { key: "1" },
      { key: "99" },
      { key: "98" },
      { key: "97" },
      { key: "0" },
    ]
    const session = socket.request.session
    session.orderHistory = []
    const sessionId = session.id
    socket.join(sessionId)
    const createOrderCommand = seedOrder.reduce((previousObject, currentObject) => {
      return Object.assign(previousObject, {
        [currentObject.uniqueID]: currentObject.name
      })
    }, {});
    const formatedMessage = [{
      type: "bot",
      message: ["1:check list of orders. ", "99:place an order. ", "98:check order history. ", "97:check your current order.", "0: cancel order"]
    }]
    let orderFlag = false
    io.to(sessionId).emit('message', formatedMessage)
    let order = []
    socket.on("user-message", data => {
      const checkCommand = commands.find(com => com.key == data.message[0])
      if (data.message[0] == "") {
        const message = ["please enter a command"]
        return formatMessage(io, sessionId, formatedMessage, message, data)
      }
      if (!checkCommand && !orderFlag) {
        const message = ["please enter a valid command"]
        return formatMessage(io, sessionId, formatedMessage, message, data)
      }
      if (checkCommand && checkCommand.key === '1') {
        orderFlag = true
        const listMessage = []
        seedOrder.map(sd => {
          let formMess = `${sd.uniqueID}: ${sd.name}`
          listMessage.push(formMess)
        })
        listMessage.push('99:place an order')
        const message = listMessage
        return formatMessage(io, sessionId, formatedMessage, message, data)
      }
      if (checkCommand && checkCommand.key === '99') {
        orderFlag = false
        if (order.length == 0) {
          const message = ["order is empty, try creating orders first by entering 1"]
          return formatMessage(io, sessionId, formatedMessage, message, data)
        }
        session.orderHistory.push(order)
        session.save()
        order = []
        const message = ["order placed", "1: to place new order"]
        return formatMessage(io, sessionId, formatedMessage, message, data)
      }
      if (checkCommand && checkCommand.key === '98') {
        if (session.orderHistory.length == 0) {
          const message = ["orderHistory is empty, try creating orders first by entering 1"]
          return formatMessage(io, sessionId, formatedMessage, message, data)
        }
        let formatMessageHist = []
        session.orderHistory.map(oH => {
          oH.map(o => {
            formatMessageHist.push(o)
          })
        })
        const message = formatMessageHist
        return formatMessage(io, sessionId, formatedMessage, message, data)
      }
      if (checkCommand && checkCommand.key === '97') {
        if (session.orderHistory.length == 0) {
          const message = ["orderHistory is empty,there is no current orders, try creating orders first by entering 1"]
          return formatMessage(io, sessionId, formatedMessage, message, data)
        }
        const message = session.orderHistory[session.orderHistory.length - 1]
        return formatMessage(io, sessionId, formatedMessage, message, data)
      }
      if (checkCommand && checkCommand.key === '0') {
        order = []
        const message = ["order cleared", "1: to create new order"]
        return formatMessage(io, sessionId, formatedMessage, message, data)
      }
      if (orderFlag) {
        const checkOrder = createOrderCommand[data.message[0]]
        if (!checkOrder) {
          const listMessage = ['order not availaible']
          seedOrder.map(sd => {
            let formMess = `${sd.uniqueID}: ${sd.name}`
            listMessage.push(formMess)
          })
          listMessage.push('99:place an order')
          const message = listMessage
          return formatMessage(io, sessionId, formatedMessage, message, data)
        }
        order.push(checkOrder)
        const message = [`${checkOrder} ordered`]
        return formatMessage(io, sessionId, formatedMessage, message, data)
      }
    })
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });
  });
}

module.exports = listen
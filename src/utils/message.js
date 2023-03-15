const formatMessage = require("../utils")
const { commands, seedOrder, initialMessage, createOrderCommand, addedMessage } = require("./constCommands")

const message = (io, sessionId, orderFlag, orderHistory, order) => data => {
  if (data.message[0] == "") {
    const message = ["please enter a command by selecting", ...initialMessage]
    return formatMessage(io, sessionId, message, data)
  }
  const checkCommand = commands.find(com => com.key == data.message[0])
  if (!checkCommand && !orderFlag) {
    const message = ["please enter a valid command by selecting", ...initialMessage]
    return formatMessage(io, sessionId, message, data)
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
    return formatMessage(io, sessionId, message, data)
  }
  if (checkCommand && checkCommand.key === '99') {
    orderFlag = false
    if (order.length == 0) {
      const message = ["order is empty, try creating orders first by entering 1"]
      return formatMessage(io, sessionId, message, data)
    }
    orderHistory[sessionId].push(order)
    order = []
    const message = ["order placed", "1: to place new order", ...addedMessage]
    return formatMessage(io, sessionId, message, data)
  }
  if (checkCommand && checkCommand.key === '98') {
    if (orderHistory[sessionId].length == 0) {
      const message = ["orderHistory is empty, try creating orders first by entering 1"]
      return formatMessage(io, sessionId, message, data)
    }
    let formatMessageHist = []
    orderHistory[sessionId].map(oH => {
      oH.map(o => {
        formatMessageHist.push(o)
      })
    })
    const message = [...formatMessageHist, "1: to place new order"]
    return formatMessage(io, sessionId, message, data)
  }
  if (checkCommand && checkCommand.key === '97') {
    if (orderHistory[sessionId].length == 0) {
      const message = ["orderHistory is empty,there is no current orders, try creating orders first by entering 1"]
      return formatMessage(io, sessionId, message, data)
    }
    const message = [...orderHistory[sessionId][orderHistory[sessionId].length - 1], "1: to place new order"]
    return formatMessage(io, sessionId, message, data)
  }
  if (orderFlag && data.message[0] === '0') {
    order = []
    orderFlag = false
    const message = ["order cleared", ...initialMessage]
    return formatMessage(io, sessionId, message, data)
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
      return formatMessage(io, sessionId, message, data)
    }
    order.push(checkOrder)
    const message = [`${checkOrder} ordered`, '0: cancel order']
    return formatMessage(io, sessionId, message, data)
  }
}

module.exports = {
  message
}
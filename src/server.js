const formatMessage = require("./utils");

function listen(io, seedOrder) {
  io.on("connection", (socket) => {
    const sessionId = socket.request.session.id
    const commands = [
      { key: "1" },
      { key: "99" },
      { key: "98" },
      { key: "97" },
    ]
    const initialMessage = ["1:check list of orders. ", "99:place an order. ", "98:check order history. ", "97:check your current order."]
    socket.join(sessionId)
    socket.on("name", data => {
      if (data === "") return
      io.to(sessionId).emit("authorize", {
        name: data, auth: true, id: sessionId,
        message: {
          type: "bot",
          message: initialMessage
        }
      })
    })
    io.to(sessionId).emit('sessionExpire', sessionId)
    const createOrderCommand = seedOrder.reduce((previousObject, currentObject) => {
      return Object.assign(previousObject, {
        [currentObject.uniqueID]: currentObject.name
      })
    }, {});
    let orderFlag = false
    let order = []
    let orderHistory = {
      [sessionId]: []
    }
    socket.on("message", data => {
      if (data.message[0] == "") {
        const message = ["please enter a command by selecting", ...initialMessage]
        return formatMessage(io, sessionId, message, data)
      }
      const checkCommand = commands.find(com => com.key == data.message[0])
      console.log(checkCommand)
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
        console.log(orderHistory[sessionId])
        order = []
        const message = ["order placed", "1: to place new order"]
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
        const message = formatMessageHist
        return formatMessage(io, sessionId, message, data)
      }
      if (checkCommand && checkCommand.key === '97') {
        if (orderHistory[sessionId].length == 0) {
          const message = ["orderHistory is empty,there is no current orders, try creating orders first by entering 1"]
          return formatMessage(io, sessionId, message, data)
        }
        const message = orderHistory[sessionId][orderHistory[sessionId].length - 1]
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
    })
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });
  });
}

module.exports = listen

//index.js
const http = require('http')
const cors = require('cors')
const app = require('./app')
const listen = require('./socket')
// const listen = require('./server')
const server = http.createServer(app)
const session = require("express-session");
// const MongoDBStore = require('connect-mongodb-session')(session)
const { Server } = require('socket.io')
require('dotenv').config()

app.use(cors())
const corsConfig = {
  origin: "http://localhost:3000",
  credentials: true,
};
const io = new Server(server, {
  cors: corsConfig,
});
const sessionMiddleware = session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
})

app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

const seedOrder = [
  {
    uniqueID: 11,
    name: 'Latte Tea',
    price: 2000
  },
  {
    uniqueID: 12,
    name: 'Ice cream',
    price: 3000
  },
  {
    uniqueID: 13,
    name: 'Berbeque',
    price: 3000
  },
  {
    uniqueID: 14,
    name: 'Chicken Roulette',
    price: 3000
  }
]

const port = process.env.PORT || 3030;
const start = async () => {
  try {
    // await connectDB(process.env.MONGODB_URL);
    // await orderModel.deleteMany({})
    // await orderModel.insertMany(seedOrder)
    server.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

listen(io, seedOrder)
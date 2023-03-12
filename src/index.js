const http = require('http')
const cors = require('cors')
const app = require('./app')
const listen = require('./socket')
const server = http.createServer(app)
const session = require("express-session");
// const MongoDBStore = require('connect-mongodb-session')(session)
const { Server } = require('socket.io')
require('dotenv').config()
// const connectDB = require('../db/db')
// const orderModel = require('../model/orders')

app.use(cors())

// const store = new MongoDBStore({
//   uri: process.env.MONGODB_URL,
//   collection: 'sessions'
// });
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
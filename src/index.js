const http = require('http')
const cors = require('cors')
const app = require('./app')
const listen = require('./socket')
const server = http.createServer(app)
const session = require("express-session");
const { Server } = require('socket.io')
require('dotenv').config()

app.use(cors())
const corsConfig = {
  origin: "http://localhost:3000",
  credentials: true,
};
// const io = new Server(server, {
//   cors: corsConfig,
// });
const io = new Server(server);
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

const port = process.env.PORT || 3030;
const start = async () => {
  try {
    server.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

listen(io)
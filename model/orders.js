const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  name: String,
  price: Number,
  uniqueID: {
    type: Number,
    unique: true
  }
})

const orderModel = mongoose.model('order', orderSchema)
module.exports = orderModel
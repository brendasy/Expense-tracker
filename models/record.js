const mongoose = require('mongoose')

const Schema = mongoose.Schema


const recordSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,

  },
  amount: {
    type: Number,
    required: true
  },
  merchant: {
    type: String
  }
})


module.exports = mongoose.model('Record', recordSchema)
const mongoose = require('mongoose')
const Record = require('../record')

mongoose.connect('mongodb://localhost/record',
  { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('db error')
})

db.once('open', () => {
  console.log('db connected!')

  Record.create({
    name: '買蘋果',
    category: '採買生食蔬果',
    date: '2020.3.13',
    amount: 100,
  })
  Record.create({
    name: '買鞋子',
    category: '採買生活用品',
    date: '2/10/2020',
    amount: 2580,
  })
  Record.create({
    name: '買咖啡',
    category: '買飲料',
    date: '2020-1-1',
    amount: 80,
  })
  console.log('done')
})
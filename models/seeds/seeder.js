const mongoose = require('mongoose')
const Record = require('../record')
const User = require('../user')
const seeds = require('../../seeder.json')
const bcrypt = require('bcryptjs')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/record',
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('db error')
})

db.once('open', () => {
  console.log('db connected!')

  const users = seeds.users
  users.forEach(user => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) throw err

        const newUser = new User({ email: user.email, name: user.name, password: hash })
        newUser.save().then().catch(err => console.log(err))

        const records = user.record
        records.forEach(record => {
          let newRecord = new Record({
            name: record.name,
            category: record.category,
            date: record.date,
            amount: record.amount,
            merchant: record.merchant,
            userId: newUser._id
          })
          newRecord.save().then().catch(err => console.log(err))
        })
      })
    })
  })

  console.log('done')
})
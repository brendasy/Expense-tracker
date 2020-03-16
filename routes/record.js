const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const { getTotal } = require('../expense-tracker')
const { authenticated } = require('../config/auth')


// 取得新增頁面
router.get('/new', authenticated, (req, res) => {
  res.render('new')
})

// 執行新增一筆資料  
router.post('/', authenticated, (req, res) => {
  const { name, category, date, amount, merchant } = req.body
  const record = new Record({
    name,
    category,
    date,
    amount,
    merchant,
    userId: req.user._id
  })
  record.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })

})

// 瀏覽全部資料
router.get('/', authenticated, (req, res) => {

  Record.find({ userId: req.user._id })
    .lean()
    .exec((err, records) => {
      if (err) return console.error(err)
      for (record of records) {

        const getTime = record.date
        record.date = (getTime.getMonth() + 1) + '-' + getTime.getDate() + '-' + getTime.getFullYear()
      }
      return res.render('index', { records, totalAmount: getTotal(records) })
    })
})

// 取得修改頁面
router.get('/:id/edit', authenticated, (req, res) => {

  Record.findOne({ _id: req.params.id, userId: req.user._id })
    .lean()
    .exec((err, record) => {
      if (err) return console.error(err)
      const getTime = record.date
      record.date = (getTime.getMonth() + 1) + '-' + getTime.getDate() + '-' + getTime.getFullYear()
      return res.render('edit', { record })
    })

})

// 修改一筆資料
router.put('/:id', authenticated, (req, res) => {

  Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    if (err) return console.error(err)

    record.name = req.body.name
    record.date = req.body.date
    record.category = req.body.category
    record.amount = req.body.amount
    record.merchant = req.body.merchant
    record.save(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

// 刪除一筆資料
router.delete('/:id', authenticated, (req, res) => {
  Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    if (err) return console.error(err)
    record.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })

})


module.exports = router
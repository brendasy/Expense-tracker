const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const { authenticated } = require('../config/auth')


// 取得新增頁面
router.get('/new', authenticated, (req, res) => {
  res.render('new')
})

// 執行新增一筆資料  
router.post('/', authenticated, (req, res) => {
  const { name, category, date, amount, merchant } = req.body

  let errors = []
  if (!name) { errors.push({ message: '消費名稱不可空白' }) }
  if (!date) { errors.push({ message: '消費日期不可空白' }) }
  if (!amount) { errors.push({ message: '消費金額不可空白' }) }
  if (errors.length > 0) {
    return res.render('new', { errors })
  }
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

  res.redirect('/')
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
  const { name, date, category, amount, merchant } = req.body
  let errors = []
  if (!name) { errors.push({ message: '消費名稱不可空白' }) }
  if (!date) { errors.push({ message: '消費日期不可空白' }) }
  if (!amount) { errors.push({ message: '消費金額不可空白' }) }
  if (errors.length > 0) {
    let record = req.body
    record._id = req.params.id
    return res.render('edit', { record, errors })
  }
  Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    if (err) return console.error(err)

    record.name = name
    record.date = date
    record.category = category
    record.amount = amount
    record.merchant = merchant
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
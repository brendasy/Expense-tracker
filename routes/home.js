const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const { authenticated } = require('../config/auth')
const { getTotal } = require('../expense-tracker')


// 瀏覽全部資料
router.get('/', authenticated, (req, res) => {
  res.redirect('/record/')
})

// 瀏覽條件篩選資料  
router.get('/filter', authenticated, (req, res) => {

  const filter = req.query

  Record.find({ userId: req.user._id })
    .lean()
    .exec((err, records) => {
      if (err) return console.error(err)

      if (filter.month || filter.category) {//是否有勾選篩選條件

        records = records.filter(record => {

          let recordsMonth = record.date.getMonth() + 1

          const getTime = record.date
          record.date = (getTime.getMonth() + 1) + '-' + getTime.getDate() + '-' + getTime.getFullYear()  //修正時間顯示格式

          if (filter.month && filter.category) {  //篩選月份&類別
            if (filter.month.includes(recordsMonth.toString()) &&  //是否符合篩選月份&類別
              filter.category.includes(record.category)) {
              return true
            }
            else { return false }
          }
          else if (filter.month) {  //僅篩選月份
            if (filter.month.includes(recordsMonth.toString())) { return true } //是否符合篩選月份
            else { return false }
          }
          else if (filter.category) { //僅篩選類別
            if (filter.category.includes(record.category)) { return true }  //是否符合篩選類別
            else { return false }
          }
          else {
            return false
          }
        })
      }
      else {

        for (record of records) {

          const getTime = record.date
          record.date = (getTime.getMonth() + 1) + '-' + getTime.getDate() + '-' + getTime.getFullYear()  //修正時間顯示格式
        }
      }

      return res.render('index', { records, totalAmount: getTotal(records), filter })

    })
})

module.exports = router
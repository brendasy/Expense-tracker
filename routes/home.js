const express = require('express')
const router = express.Router()
const Record = require('../models/record')


// 瀏覽全部資料
router.get('/', (req, res) => {
  res.redirect('/record/')
})

// 瀏覽條件篩選資料  
router.get('/filter', (req, res) => {

  const filter = req.query

  Record.find()
    .lean()
    .exec((err, records) => {
      if (err) return console.error(err)

      if (filter.month || filter.category) {//是否有勾選篩選條件

        records = records.filter(record => {

          let recordsMonth = record.date.getMonth() + 1

          if (filter.month) { //是否有勾選月份
            if (typeof (filter.month) === 'string') {//是否只有勾選單一月份
              if (filter.month === recordsMonth.toString()) return true
            }
            else if (filter.month.includes(recordsMonth.toString())) {
              return true
            }
          }
          if (filter.category) { //是否有勾選類別

            if (typeof (filter.category) === 'string') {//是否只有勾選單一類別
              if (filter.category === record.category) return true
            }
            else if (filter.category.includes(record.category)) {
              return true
            }
          }
          return false
        })
      }

      return res.render('index', { records, totalAmount: getTotal(records), filter })

    })
})

module.exports = router
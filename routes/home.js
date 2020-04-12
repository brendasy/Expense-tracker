const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const { authenticated } = require('../config/auth')
const { getTotal } = require('../expense-tracker')


// 瀏覽全部資料
// 瀏覽條件篩選資料  
router.get('/', authenticated, (req, res) => {

  const filter = req.query.filter || ''   //避免filter成為undefined,將預設值設為空字串
  const sort = req.query.sort || ''
  const category = filter.category

  if (sort !== undefined) {
    if (sort[Object.keys(sort)[0]] === '--1') { // 當作第二次點擊相同欄位 排序時 會作升冪降冪互換
      sort[Object.keys(sort)[0]] = '1'
    }
  }

  Record.find({
    userId: req.user._id,
    category: category ? { $in: category } : { $exists: true }  //若沒有勾選類別篩選 則顯示所有 有類別欄位資料 的文件
  })
    .sort(sort)
    .lean()
    .exec((err, records) => {
      if (err) return console.error(err)

      if (filter.month || filter.category) {//是否有勾選篩選條件

        records = records.filter(record => {

          let recordsMonth = record.date.getMonth() + 1

          const getTime = record.date
          record.date = getTime.toLocaleDateString()  //修正時間顯示格式

          if (filter.month) {  //若有篩選月份
            return (filter.month.includes(recordsMonth.toString())) //驗證是否符合篩選月份
          }

          return true
        })
      }
      else {

        for (record of records) {
          const getTime = record.date
          record.date = getTime.toLocaleDateString()
          //record.date = (getTime.getMonth() + 1) + '-' + getTime.getDate() + '-' + getTime.getFullYear()  //修正時間顯示格式
        }
      }

      return res.render('index', { records, totalAmount: getTotal(records), filter, sort })

    })
})

module.exports = router
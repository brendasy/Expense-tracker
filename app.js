const express = require('express')
const app = express()
const exhbs = require('express-handlebars')
const mongoose = require('mongoose')
const Record = require('./models/record')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
app.use(express.static('public'))

app.engine('handlebars', exhbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const { getTotal } = require('./expense-tracker')

mongoose.connect('mongodb://localhost/record', { useNewUrlParser: true, useUnifiedTopology: true })   // 設定連線到 mongoDB

// mongoose 連線後透過 mongoose.connection 拿到 Connection 的物件
const db = mongoose.connection

// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})

// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})





// 取得新增頁面
app.get('/record/new', (req, res) => {
  res.render('new')
})

// 執行新增一筆資料  
app.post('/record/', (req, res) => {

  const record = new Record(req.body)
  record.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })

})

// 瀏覽全部資料
app.get('/record', (req, res) => {

  Record.find()
    .lean()
    .exec((err, records) => {
      if (err) return console.error(err)

      return res.render('index', { records, totalAmount: getTotal(records) })
    })
})
// 瀏覽全部資料
app.get('/', (req, res) => {
  res.redirect('/record/')
})

// 取得修改頁面
app.get('/record/:id/edit', (req, res) => {

  Record.findById(req.params.id)
    .lean()
    .exec((err, record) => {
      if (err) return console.error(err)

      return res.render('edit', { record })
    })

})

// 修改一筆資料
app.put('/record/:id', (req, res) => {

  Record.findById(req.params.id, (err, record) => {
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

// 瀏覽條件篩選資料  
app.get('/filter', (req, res) => {

  const filter = req.query

  Record.find()
    .lean()
    .exec((err, records) => {
      if (err) return console.error(err)

      if (filter.month || filter.category) {

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

// 刪除一筆資料
app.delete('/record/:id', (req, res) => {
  console.log("delete")
})









app.listen(3000, () => {
  console.log('express is running on port 3000')
})

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

app.get('/', (req, res) => {

  Record.find()
    .lean()
    .exec((err, records) => {
      if (err) return console.error(err)
      console.log('records', records)
      return res.render('index', { records })
    })

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

})
// 瀏覽一筆資料
app.get('/record/:id', (req, res) => {

})
// 瀏覽條件篩選資料  
app.get('/record/?search =', (req, res) => {

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
// 刪除一筆資料
app.delete('/record/:id', (req, res) => {
  console.log("delete")
})









app.listen(3000, () => {
  console.log('express is running on port 3000')
})
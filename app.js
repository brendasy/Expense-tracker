const express = require('express')
const app = express()
const exhbs = require('express-handlebars')

app.engine('handlebars', exhbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {

  res.render('index')
})

app.listen(3000, () => {
  console.log('express is running on port 3000')
})
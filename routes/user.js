const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')


//登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

//執行登入
router.post('/login', (req, res) => {

})

//註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

//執行註冊
router.post('/register', (req, res) => {
  const { email, name, password, password2 } = req.body
  let errors = []

  if (!email || !password || !password2) {
    errors.push({ message: 'e-mail 與密碼請勿空白' })
  }

  if (password !== password2) {
    errors.push({ message: '密碼兩次輸入不相同' })
  }
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    })
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        // 使用者已經註冊過
        errors.push({ message: '這個 Email 已經註冊過了' })
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        })
      } else {
        const user = new User({ email, name, password })
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err
            user.password = hash

            user.save().then(user => {
              res.redirect('/')                         // 新增完成導回首頁
            }).catch(err => console.log(err))

          })
        })
      }
    })
  }
})

module.exports = router
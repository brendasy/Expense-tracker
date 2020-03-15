const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const passport = require('passport')

//登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

//執行登入
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { // 使用 passport 認證
    successRedirect: '/', // 登入成功會回到根目錄
    failureRedirect: '/user/login', // 失敗會留在登入頁面
    failureFlash: true
  })(req, res, next)
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

// 登出
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', "您已成功登出")
  res.redirect('/user/login')
})

module.exports = router
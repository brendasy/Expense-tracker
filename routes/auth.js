const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
)

router.get('/facebook/callback',
  passport.authenticate('facebook',
    {
      failureRedirect: '/user/login',
      successRedirect: '/'
    })
)


module.exports = router
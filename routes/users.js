const express = require('express')
const router = express.Router()
const passport = require('passport');

let User = require('../models/user')

router.get('/register', (req, res)=>{
  if(res.locals.user)
    res.redirect('/')
  else
    res.render('register')
})

router.post('/register', (req, res)=>{
  let name = req.body.name
  let username = req.body.username
  let password = req.body.password

  let newUser = new User({
      name: name,
      username: username,
      password: password
  })
  newUser.save((err)=>{
    if (err)
      throw err
    else
    res.redirect('/login')
  })
})

router.get('/login', (req, res)=>{
  if(res.locals.user)
    res.redirect('/')
  else
    res.render('login')
})
router.post('/login', (req, res, next)=>{
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash:true
  })(req, res, next)
})
router.get('/logout', (req, res)=>{
  req.logout()
  res.redirect('/users/login')
})
module.exports = router

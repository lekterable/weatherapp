const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

let User = require('../models/user')

//Rejestracja
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
  bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(newUser.password, salt, (err, hash)=>{
      if(err)
        throw err
      else {
        newUser.password = hash
        newUser.save((err)=>{
          if (err)
            throw err
          else
          res.redirect('/users/login')
        })
      }
    })
  })
})

//Logowanie
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

//Profil
router.get('/profile', (req, res)=>{
  if(!res.locals.user)
    res.redirect('/')
  else
    res.render('profile')
})

//Wylogowywanie
router.get('/logout', (req, res)=>{
  req.logout()
  res.redirect('/users/login')
})

module.exports = router

const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

let User = require('../models/user')

//Rejestracja
router.get('/register', (req, res)=>{
  if(res.locals.user){
    req.flash('danger', 'Już jesteś zalogowany')
    res.redirect('/')
  } else
    res.render('register')
})

router.post('/register', (req, res)=>{
  let name = req.body.name
  let username = req.body.username
  let password = req.body.password
  //Walidacja formularza
  req.checkBody('name', 'Imie jest wymagane').notEmpty()
  req.checkBody('username', 'Nazwa użytkownika jest wymagana').notEmpty()
  req.checkBody('password', 'Hasło jest wymagane').notEmpty()
  let errors = req.validationErrors()
  if(errors){
    res.render('register', {
      errors: errors
    })
  } else{
    let newUser = new User({
      name: name,
      username: username,
      password: password
    })
    //Hashowanie hasła
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(newUser.password, salt, (err, hash)=>{
        if(err)
          throw err
        else {
          newUser.password = hash
          newUser.save((err)=>{
            if (err)
              throw err
            else{
              req.flash('success', 'Zarejestrowano pomyślnie, możesz się zalogować')
              res.redirect('/users/login')
            }
          })
        }
      })
    })
  }
})

//Logowanie
router.get('/login', (req, res)=>{
  if(res.locals.user){
    req.flash('danger', 'Już jesteś zalogowany')
    res.redirect('/')
  } else
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
router.get('/profile', ensureAuthenticated, (req, res)=>{
  res.render('profile')
})
router.post('/profile', ensureAuthenticated, (req, res)=>{
  let query = {_id:req.user._id}
  User.update({_id:req.user._id},{$set: {
    name: req.body.name,
    city: req.body.city
  }}, ()=>{
    res.redirect('/users/profile')
  })
})
//Wylogowywanie
router.get('/logout', (req, res)=>{
  req.logout()
  req.flash('success', 'Wylogowano pomyślnie')
  res.redirect('/users/login')
})

//Sprawdzenie zalogowania
function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated())
    return next()
  else {
    req.flash('danger', 'Zaloguj się')
    res.redirect('/users/login')
  }
}

module.exports = router

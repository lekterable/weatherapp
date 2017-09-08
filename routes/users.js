const express = require('express')
const router = express.Router()
let User = require('../models/user')

router.get('/register', (req, res)=>{
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

module.exports = router

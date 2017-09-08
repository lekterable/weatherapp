const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const config = require('../config/database')

module.exports = (passport)=>{
  passport.use(new LocalStrategy((username, password, done)=>{
    //Dopasuj nazwę użytkownika
    let query = {username:username}
    User.findOne(query, (err, user)=>{
      if(err)
        throw err
      if(!user)
        return done(null, false)
      //Dopasuj hasło
      if(password === user.password)
        return done(null, user)
      else
        return done(null, false)
    })
  }))
  passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user)
  })
})
}

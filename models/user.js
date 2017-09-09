const mongoose = require('mongoose')

let UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  city:{
    type: String
  }
})

let User = module.exports = mongoose.model('User', UserSchema)

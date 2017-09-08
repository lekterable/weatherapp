const bodyParser = require('body-parser')
const path = require('path')
const http = require('http')
const mongoose = require('mongoose');
const config = require('./config/database');
const passport = require('passport');
const session = require('express-session');

const express = require('express')
const app = express()


//Połączenie z bazą
mongoose.connect(config.database,{useMongoClient: true},()=>{
  console.log('Połączono z bazą');
})
//Silnik szablonów
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
//Body Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
//Folder publiczny
app.use(express.static(path.join(__dirname, 'public')))
//Express session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))
//Passport config
require('./config/passport')(passport)

//Passport
app.use(passport.initialize())
app.use(passport.session())

app.get('*', (req, res, next)=>{
  res.locals.user = req.user || null
  next()
})

app.get('/', (req, res)=>{
  if(req.session.data)
  res.render('index', {
    city: req.session.data.city,
    weather : req.session.data.weather
  })
  else
  res.render('index')

})
//Routing
app.use('/users', require('./routes/users'))

app.post('/', (req, res)=>{
  http.request({
    host: 'api.openweathermap.org',
    path: '/data/2.5/weather?q='+req.body.city.replace(" ", "+")+'&APPID=06e5fdd3ecb076d68f8f8e9eefbd492d&units=metric'
  }, (weather)=>{
    weatherData = ''
    weather.on('data', (chunk)=>{
      weatherData+=chunk
    })
    weather.on('end', ()=>{
      data = JSON.parse(weatherData)
      req.session.data = {
        weather:data.main.temp,
        city: req.body.city[0].toUpperCase()+req.body.city.slice(1)
      }
      res.redirect('/')
    })
  }).end()
})

app.listen(3000, ()=>{
  console.log('Serwer uruchomiony na porcie 3000')
})
